/**
 * ReportHeuristicBugWizard.tsx
 *
 * Modal-based, 3-step wizard that lets a stakeholder report a bug on an
 * existing heuristic. Pure presentational + state component — persistence
 * is the host's job (passed in via `onSubmit`).
 *
 * Spec: FEEDBACK_WIZARDS_SPEC.md.
 */

import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import {
  AttachedScreenshot,
  BUG_SUBJECTS,
  BugReportPayload,
  BugSubject,
  DiscardConfirm,
  ElementPicker,
  FeedbackModalShell,
  HEURISTIC_ELEMENT_GROUPS,
  HeuristicElementGroup,
  HeuristicElementRef,
  MAX_DESCRIPTION_CHARS,
  MAX_SUBJECT_OTHER_CHARS,
  MIN_DESCRIPTION_CHARS,
  Reporter,
  ScreenshotDropzone,
  SubjectChips,
  SubmitErrorBanner,
  TextareaField,
  UrlField,
  describeElementRef,
  formatBytes,
  isValidHttpUrl,
  usePasteScreenshot
} from './feedbackWizardShared'

const STEP_LABELS = ['Element', 'Issue', 'Details']

const STRINGS = {
  title: 'Report a bug',
  step1Helper: 'Pick the heuristic or element this bug is about. If it’s broader, choose “Spans several components” or “Generic / I’m not sure”.',
  step2Helper: 'What kind of issue is it?',
  descriptionLabel: 'Description',
  descriptionHelper: 'What’s broken? What did you expect to happen?',
  descriptionPlaceholder: 'e.g. Padding gets removed from the header on mobile when the logo is centered…',
  editorLabel: 'Editor link (optional)',
  editorHelper: 'Link to the editor environment where the bug is reproducible.',
  publishedLabel: 'Live site link (optional)',
  publishedHelper: 'Public URL where the issue is visible.',
  screenshotLabel: 'Screenshot (optional, strongly encouraged)',
  screenshotHelper: 'Drag-and-drop, paste, or browse. PNG / JPEG / WebP.',
  evidenceNote:
    'At least one of: live link, editor link, or screenshot is recommended so we can reproduce the issue. None are strictly required.',
  discard: 'Discard this report?'
} as const

/* ─────────────────────────────────────────────────────────────────
 *  State
 * ───────────────────────────────────────────────────────────────── */

type State = {
  step: 1 | 2 | 3
  element: HeuristicElementRef | null
  subject: BugSubject | null
  subjectOther: string
  description: string
  editorUrl: string
  publishedUrl: string
  screenshot: AttachedScreenshot | null
  submitting: boolean
  submitError: string | null
}

type Action =
  | { type: 'reset'; prefillElement?: string | null }
  | { type: 'goto'; step: 1 | 2 | 3 }
  | { type: 'set'; patch: Partial<State> }

function init(prefill?: string | null): State {
  return {
    step: 1,
    element: prefill ? { kind: 'element', canonical: prefill } : null,
    subject: null,
    subjectOther: '',
    description: '',
    editorUrl: '',
    publishedUrl: '',
    screenshot: null,
    submitting: false,
    submitError: null
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return init(action.prefillElement ?? null)
    case 'goto':
      return { ...state, step: action.step }
    case 'set':
      return { ...state, ...action.patch }
  }
}

/* ─────────────────────────────────────────────────────────────────
 *  Component
 * ───────────────────────────────────────────────────────────────── */

export type ReportHeuristicBugWizardProps = {
  open: boolean
  onClose: () => void
  onSubmit: (payload: BugReportPayload) => Promise<void>
  elementGroups?: HeuristicElementGroup[]
  reporter?: Reporter
  prefillElement?: string | null
}

export function ReportHeuristicBugWizard({
  open,
  onClose,
  onSubmit,
  elementGroups = HEURISTIC_ELEMENT_GROUPS,
  reporter,
  prefillElement = null
}: ReportHeuristicBugWizardProps) {
  const [state, dispatch] = useReducer(reducer, prefillElement, init)
  const [discardOpen, setDiscardOpen] = useState(false)

  const lastPrefillRef = React.useRef(prefillElement)
  useEffect(() => {
    // Same key (or unchanged) → keep the draft. Different prefill → reset.
    if (open && lastPrefillRef.current !== prefillElement) {
      dispatch({ type: 'reset', prefillElement })
      lastPrefillRef.current = prefillElement
    }
  }, [open, prefillElement])

  // Reset state when the modal is fully closed and re-opened with same prefill.
  useEffect(() => {
    if (!open) {
      // Defer reset to next open with different prefill; nothing to do here.
    }
  }, [open])

  const isDirty = useMemo(() => {
    if (state.element && (state.element.kind !== 'element' || state.element.canonical !== prefillElement)) return true
    if (state.subject) return true
    if (state.subjectOther.trim()) return true
    if (state.description.trim()) return true
    if (state.editorUrl.trim()) return true
    if (state.publishedUrl.trim()) return true
    if (state.screenshot) return true
    return false
  }, [state, prefillElement])

  const requestClose = useCallback(() => {
    if (state.submitting) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }, [isDirty, onClose, state.submitting])

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (discardOpen) return
      if (state.step > 1) {
        dispatch({ type: 'goto', step: (state.step - 1) as 1 | 2 })
      } else {
        requestClose()
      }
    },
    [discardOpen, requestClose, state.step]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, handleEscape])

  // Paste-to-attach when on step 3 and no screenshot yet.
  usePasteScreenshot(open && state.step === 3 && !state.screenshot, file => {
    void ingestPastedFile(file)
  })

  const ingestPastedFile = async (file: File) => {
    // Re-use the dropzone validation by calling onChange via a synthetic flow.
    // Simpler: rely on ScreenshotDropzone's internal logic by setting a flag.
    // For this paste path we mirror the same constraints inline.
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return
    try {
      const reader = new FileReader()
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(String(reader.result || ''))
        reader.onerror = () => rej(new Error('read'))
        reader.readAsDataURL(file)
      })
      const img = new Image()
      const dims: { w: number; h: number } = await new Promise((res, rej) => {
        img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight })
        img.onerror = () => rej(new Error('decode'))
        img.src = dataUrl
      })
      dispatch({
        type: 'set',
        patch: {
          screenshot: {
            file,
            dataUrl,
            width: dims.w,
            height: dims.h,
            sizeBytes: file.size
          }
        }
      })
    } catch {
      /* ignored */
    }
  }

  /* ── per-step validity ───────────────────────────────────────── */

  const canAdvanceStep1 = state.element !== null
  const canAdvanceStep2 =
    state.subject !== null &&
    (state.subject !== 'other' || state.subjectOther.trim().length > 0)

  const editorTrim = state.editorUrl.trim()
  const publishedTrim = state.publishedUrl.trim()
  const editorInvalid = editorTrim.length > 0 && !isValidHttpUrl(editorTrim)
  const publishedInvalid = publishedTrim.length > 0 && !isValidHttpUrl(publishedTrim)
  const descriptionOK =
    state.description.length >= MIN_DESCRIPTION_CHARS &&
    state.description.length <= MAX_DESCRIPTION_CHARS

  const canSubmit =
    canAdvanceStep1 &&
    canAdvanceStep2 &&
    descriptionOK &&
    !editorInvalid &&
    !publishedInvalid &&
    !state.submitting

  /* ── submit ──────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    if (!canSubmit || !state.element || !state.subject) return
    const payload: BugReportPayload = {
      kind: 'bug',
      element: state.element,
      subject: state.subject,
      subjectOther:
        state.subject === 'other' ? state.subjectOther.trim().slice(0, MAX_SUBJECT_OTHER_CHARS) : undefined,
      description: state.description.trim(),
      editorUrl: editorTrim || undefined,
      publishedUrl: publishedTrim || undefined,
      screenshot: state.screenshot || undefined,
      reporter,
      createdAt: new Date().toISOString()
    }
    dispatch({ type: 'set', patch: { submitting: true, submitError: null } })
    try {
      await onSubmit(payload)
      // On success, fully reset and close. The host owns toast/feedback.
      dispatch({ type: 'reset', prefillElement })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      dispatch({ type: 'set', patch: { submitting: false, submitError: message } })
    }
  }

  /* ── footer ──────────────────────────────────────────────────── */

  const footer = (
    <>
      <div className="heur-fb-footer-side">
        {state.step > 1 ? (
          <button
            type="button"
            className="heur-fb-btn-ghost"
            onClick={() => dispatch({ type: 'goto', step: (state.step - 1) as 1 | 2 })}
            disabled={state.submitting}
          >
            Back
          </button>
        ) : (
          <span />
        )}
      </div>
      <div className="heur-fb-footer-side">
        {state.step < 3 ? (
          <button
            type="button"
            className="heur-fb-btn-primary"
            onClick={() =>
              dispatch({ type: 'goto', step: (state.step + 1) as 2 | 3 })
            }
            disabled={
              (state.step === 1 && !canAdvanceStep1) ||
              (state.step === 2 && !canAdvanceStep2)
            }
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="heur-fb-btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {state.submitting ? 'Sending…' : 'Submit report'}
          </button>
        )}
      </div>
    </>
  )

  /* ── render ──────────────────────────────────────────────────── */

  return (
    <>
      <FeedbackModalShell
        open={open}
        title={STRINGS.title}
        onCloseRequested={requestClose}
        footer={footer}
        stepLabels={STEP_LABELS}
        currentStep={state.step}
      >
        {state.submitError && <SubmitErrorBanner message={state.submitError} />}
        {state.step === 1 && (
          <ElementPicker
            groups={elementGroups}
            value={state.element}
            onChange={el => dispatch({ type: 'set', patch: { element: el } })}
            lockedTo={prefillElement || null}
            helperText={STRINGS.step1Helper}
          />
        )}
        {state.step === 2 && (
          <SubjectChips
            options={BUG_SUBJECTS}
            value={state.subject}
            onChange={s => dispatch({ type: 'set', patch: { subject: s } })}
            otherValue={state.subjectOther}
            onOtherChange={v => dispatch({ type: 'set', patch: { subjectOther: v } })}
            helperText={STRINGS.step2Helper}
          />
        )}
        {state.step === 3 && (
          <div>
            <TextareaField
              label={STRINGS.descriptionLabel}
              value={state.description}
              onChange={v => dispatch({ type: 'set', patch: { description: v } })}
              helperText={STRINGS.descriptionHelper}
              placeholder={STRINGS.descriptionPlaceholder}
              required
            />
            <UrlField
              label={STRINGS.editorLabel}
              value={state.editorUrl}
              onChange={v => dispatch({ type: 'set', patch: { editorUrl: v } })}
              helperText={STRINGS.editorHelper}
            />
            <UrlField
              label={STRINGS.publishedLabel}
              value={state.publishedUrl}
              onChange={v => dispatch({ type: 'set', patch: { publishedUrl: v } })}
              helperText={STRINGS.publishedHelper}
            />
            <ScreenshotDropzone
              label={STRINGS.screenshotLabel}
              helperText={STRINGS.screenshotHelper}
              value={state.screenshot}
              onChange={s => dispatch({ type: 'set', patch: { screenshot: s } })}
            />
            <p className="heur-fb-helper" style={{ marginTop: 4 }}>
              {STRINGS.evidenceNote}
            </p>
            <ReportPreview state={state} />
          </div>
        )}
      </FeedbackModalShell>
      {discardOpen && (
        <DiscardConfirm
          message={STRINGS.discard}
          onKeepEditing={() => setDiscardOpen(false)}
          onDiscard={() => {
            setDiscardOpen(false)
            dispatch({ type: 'reset', prefillElement })
            onClose()
          }}
        />
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Inline review summary (rendered above the submit button)
 * ───────────────────────────────────────────────────────────────── */

function ReportPreview({ state }: { state: State }) {
  const subjectLabel =
    BUG_SUBJECTS.find(o => o.id === state.subject)?.label || ''
  const subjectDisplay =
    state.subject === 'other' ? `Other — ${state.subjectOther.trim() || '…'}` : subjectLabel

  return (
    <div className="heur-fb-review-card" style={{ marginTop: 16 }}>
      <div className="heur-fb-review-row">
        <div className="heur-fb-review-label">Element</div>
        <div className="heur-fb-review-value">
          {state.element ? describeElementRef(state.element) : <em className="heur-fb-review-empty">Not selected</em>}
        </div>
      </div>
      <div className="heur-fb-review-row">
        <div className="heur-fb-review-label">Issue</div>
        <div className="heur-fb-review-value">
          {state.subject ? subjectDisplay : <em className="heur-fb-review-empty">Not selected</em>}
        </div>
      </div>
      <div className="heur-fb-review-row">
        <div className="heur-fb-review-label">Evidence</div>
        <div className="heur-fb-review-value">
          {[
            state.editorUrl.trim() && 'editor link',
            state.publishedUrl.trim() && 'live link',
            state.screenshot && `screenshot (${formatBytes(state.screenshot.sizeBytes)})`
          ]
            .filter(Boolean)
            .join(' · ') || <em className="heur-fb-review-empty">None attached</em>}
        </div>
      </div>
    </div>
  )
}

export default ReportHeuristicBugWizard
