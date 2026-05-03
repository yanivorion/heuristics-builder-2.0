/**
 * feedbackWizardShared.tsx
 *
 * Shared types, constants, and presentational primitives for the two
 * stakeholder feedback wizards: ReportHeuristicBugWizard and
 * RequestHeuristicWizard.
 *
 * Spec: FEEDBACK_WIZARDS_SPEC.md (root of the repo).
 *
 * Visual identity inherits the Lucas Berghoef palette CSS variables
 * already defined in studio-heuristics-manager/src/styles/app.css
 * (--lb-*, --text-*, etc.). No hard-coded hex values are introduced
 * inside this file — only references to those tokens.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useId,
  useMemo
} from 'react'

/* ─────────────────────────────────────────────────────────────────
 *  Public shared types
 * ───────────────────────────────────────────────────────────────── */

export type HeuristicElementRef =
  | { kind: 'element'; canonical: string }
  | { kind: 'multiple' }
  | { kind: 'unsure' }

export type AttachedScreenshot = {
  file: File
  dataUrl: string
  width: number
  height: number
  sizeBytes: number
}

export type Reporter = { name?: string; email?: string }

export type BugSubject =
  | 'spacing'
  | 'padding'
  | 'margin'
  | 'alignment'
  | 'layout'
  | 'sizing'
  | 'order'
  | 'visibility'
  | 'typography'
  | 'generic'
  | 'other'

export type RequestSubject =
  | 'spacing'
  | 'padding'
  | 'margin'
  | 'alignment'
  | 'layout'
  | 'sizing'
  | 'order'
  | 'visibility'
  | 'typography'
  | 'new-behavior'
  | 'other'

export type BugReportPayload = {
  kind: 'bug'
  element: HeuristicElementRef
  subject: BugSubject
  subjectOther?: string
  description: string
  editorUrl?: string
  publishedUrl?: string
  screenshot?: AttachedScreenshot
  reporter?: Reporter
  createdAt: string
}

export type HeuristicRequestPayload = {
  kind: 'request'
  element: HeuristicElementRef
  subject: RequestSubject
  subjectOther?: string
  description: string
  editorUrl?: string
  publishedUrl?: string
  screenshot?: AttachedScreenshot
  reporter?: Reporter
  createdAt: string
}

export type HeuristicElementGroup = {
  id: string
  label: string
  elements: string[]
}

/* ─────────────────────────────────────────────────────────────────
 *  Constants
 * ───────────────────────────────────────────────────────────────── */

export const MIN_DESCRIPTION_CHARS = 10
export const MAX_DESCRIPTION_CHARS = 2000
export const MAX_SUBJECT_OTHER_CHARS = 60
export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024 // 5 MB
export const MAX_SCREENSHOT_DIM = 4096
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/**
 * Default canonical-element groups. Mirrors HEURISTICS_ELEMENTS.md so the
 * picker has something useful even if the host doesn't pass `elements`.
 * Hosts may override entirely via the `elementGroups` prop.
 */
export const HEURISTIC_ELEMENT_GROUPS: HeuristicElementGroup[] = [
  {
    id: 'containers',
    label: 'Containers / System',
    elements: [
      'Container Box',
      'System Container',
      'Repeaters',
      'Pinned Element',
      'Custom Element'
    ]
  },
  {
    id: 'text',
    label: 'Text',
    elements: ['Text Box', 'Rich Text', 'Text Mask', 'Text Marquee', 'Collapsible Text']
  },
  {
    id: 'media',
    label: 'Media',
    elements: [
      'Image',
      'Video Box',
      'Single Video Player',
      'Transparent Video',
      'Audio Player',
      'Lottie Animation',
      'Lightbox',
      'Embed Site / Code',
      'Google Maps'
    ]
  },
  {
    id: 'shapes',
    label: 'Shapes / Lines',
    elements: ['Horizontal Line', 'Vertical Line', 'Shape (SVG)']
  },
  {
    id: 'navigation',
    label: 'Navigation / Header',
    elements: [
      'Logo',
      'Logo Component',
      'Hamburger Menu',
      'Breadcrumbs',
      'Site Search',
      'Social Bar'
    ]
  },
  {
    id: 'controls',
    label: 'Controls / Interactive',
    elements: ['Button', 'Accordion', 'Tabs', 'Tags', 'Sliders', 'Progress Bar', 'Ratings']
  },
  {
    id: 'forms',
    label: 'Form Inputs',
    elements: [
      'Text Input',
      'Address Input',
      'Date Picker',
      'Dropdowns',
      'Checkboxes',
      'Multi Checkboxes',
      'Radio Buttons',
      'Switch',
      'Signature',
      'Upload Buttons',
      'Recaptcha'
    ]
  }
]

export type SubjectOption<T extends string> = { id: T; label: string }

export const BUG_SUBJECTS: SubjectOption<BugSubject>[] = [
  { id: 'spacing', label: 'Spacing' },
  { id: 'padding', label: 'Padding' },
  { id: 'margin', label: 'Margin' },
  { id: 'alignment', label: 'Alignment' },
  { id: 'layout', label: 'Layout' },
  { id: 'sizing', label: 'Sizing' },
  { id: 'order', label: 'Content order' },
  { id: 'visibility', label: 'Visibility / Pinning' },
  { id: 'typography', label: 'Typography' },
  { id: 'generic', label: 'Generic' },
  { id: 'other', label: 'Other' }
]

export const REQUEST_SUBJECTS: SubjectOption<RequestSubject>[] = [
  { id: 'spacing', label: 'Spacing' },
  { id: 'padding', label: 'Padding' },
  { id: 'margin', label: 'Margin' },
  { id: 'alignment', label: 'Alignment' },
  { id: 'layout', label: 'Layout' },
  { id: 'sizing', label: 'Sizing' },
  { id: 'order', label: 'Content order' },
  { id: 'visibility', label: 'Visibility / Pinning' },
  { id: 'typography', label: 'Typography' },
  { id: 'new-behavior', label: 'New behavior' },
  { id: 'other', label: 'Other' }
]

/* ─────────────────────────────────────────────────────────────────
 *  Helpers
 * ───────────────────────────────────────────────────────────────── */

export function isValidHttpUrl(value: string): boolean {
  if (!value) return false
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function readImageMeta(
  file: File
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      const img = new Image()
      img.onload = () => resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Could not decode image'))
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

export function describeElementRef(ref: HeuristicElementRef): string {
  if (ref.kind === 'element') return ref.canonical
  if (ref.kind === 'multiple') return 'Spans several components'
  return 'Generic / I’m not sure'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ─────────────────────────────────────────────────────────────────
 *  Modal shell
 * ───────────────────────────────────────────────────────────────── */

export type FeedbackModalShellProps = {
  open: boolean
  title: string
  onCloseRequested: () => void
  footer: React.ReactNode
  children: React.ReactNode
  /**
   * Steps array used by FeedbackStepper. Passed in so the title bar can
   * size correctly and so we know how many steps exist for the step
   * progress aria-label.
   */
  stepLabels: string[]
  currentStep: number
  ariaLabel?: string
}

export function FeedbackModalShell({
  open,
  title,
  onCloseRequested,
  footer,
  children,
  stepLabels,
  currentStep,
  ariaLabel
}: FeedbackModalShellProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()

    return () => {
      document.body.style.overflow = prevOverflow
      previouslyFocused.current?.focus?.()
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null || el === document.activeElement)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div className="heur-fb-overlay" onMouseDown={onCloseRequested}>
      <div
        ref={dialogRef}
        className="heur-fb-modal"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="heur-fb-topbar">
          <h2 className="heur-fb-title">{title}</h2>
          <button
            type="button"
            className="heur-fb-close"
            aria-label="Close"
            onClick={onCloseRequested}
          >
            ×
          </button>
        </div>
        <div className="heur-fb-stepper-row" aria-label={`Step ${currentStep} of ${stepLabels.length}`}>
          <FeedbackStepper labels={stepLabels} current={currentStep} />
        </div>
        <div className="heur-fb-body">{children}</div>
        <div className="heur-fb-footer">{footer}</div>
      </div>
      <FeedbackSharedStyles />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Stepper
 * ───────────────────────────────────────────────────────────────── */

export function FeedbackStepper({ labels, current }: { labels: string[]; current: number }) {
  return (
    <ol className="heur-fb-stepper" role="list">
      {labels.map((label, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'active' : 'todo'
        return (
          <li
            key={label}
            className={`heur-fb-step heur-fb-step-${state}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className="heur-fb-step-num">{n}</span>
            <span className="heur-fb-step-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Element picker
 * ───────────────────────────────────────────────────────────────── */

export type ElementPickerProps = {
  groups: HeuristicElementGroup[]
  value: HeuristicElementRef | null
  onChange: (next: HeuristicElementRef) => void
  lockedTo?: string | null
  helperText?: string
}

export function ElementPicker({
  groups,
  value,
  onChange,
  lockedTo = null,
  helperText
}: ElementPickerProps) {
  const [filter, setFilter] = useState('')
  const filtered = useMemo(() => {
    if (!filter.trim()) return groups
    const q = filter.toLowerCase()
    return groups
      .map(g => ({ ...g, elements: g.elements.filter(el => el.toLowerCase().includes(q)) }))
      .filter(g => g.elements.length > 0)
  }, [groups, filter])

  const selectedCanonical = value?.kind === 'element' ? value.canonical : null
  const selectedSynthetic = value?.kind === 'multiple' ? 'multiple' : value?.kind === 'unsure' ? 'unsure' : null

  return (
    <div className="heur-fb-picker">
      {lockedTo ? (
        <div className="heur-fb-locked-banner" role="note">
          Element locked to <strong>{lockedTo}</strong>.
        </div>
      ) : (
        <>
          {helperText && <p className="heur-fb-helper">{helperText}</p>}
          <div className="heur-fb-search">
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter elements…"
              aria-label="Filter elements"
            />
          </div>
          <div className="heur-fb-tile-row heur-fb-tile-row-synthetic">
            <SyntheticTile
              label="Spans several components"
              hint="Cross-cutting issue across many elements"
              selected={selectedSynthetic === 'multiple'}
              onClick={() => onChange({ kind: 'multiple' })}
            />
            <SyntheticTile
              label="Generic / I’m not sure"
              hint="Not sure how to classify it"
              selected={selectedSynthetic === 'unsure'}
              onClick={() => onChange({ kind: 'unsure' })}
            />
          </div>
          {filtered.map(group => (
            <fieldset key={group.id} className="heur-fb-group">
              <legend className="heur-fb-group-legend">{group.label}</legend>
              <div className="heur-fb-tile-row">
                {group.elements.map(el => (
                  <ElementTile
                    key={el}
                    label={el}
                    selected={selectedCanonical === el}
                    onClick={() => onChange({ kind: 'element', canonical: el })}
                  />
                ))}
              </div>
            </fieldset>
          ))}
          {filtered.length === 0 && (
            <p className="heur-fb-empty">No elements match “{filter}”.</p>
          )}
        </>
      )}
    </div>
  )
}

function ElementTile({
  label,
  selected,
  onClick
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`heur-fb-tile ${selected ? 'heur-fb-tile-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="heur-fb-tile-label">{label}</span>
    </button>
  )
}

function SyntheticTile({
  label,
  hint,
  selected,
  onClick
}: {
  label: string
  hint: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`heur-fb-tile heur-fb-tile-synthetic ${selected ? 'heur-fb-tile-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="heur-fb-tile-label">{label}</span>
      <span className="heur-fb-tile-hint">{hint}</span>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Subject chips (single-select with "Other" sub-input)
 * ───────────────────────────────────────────────────────────────── */

export type SubjectChipsProps<T extends string> = {
  options: SubjectOption<T>[]
  value: T | null
  onChange: (next: T) => void
  otherValue: string
  onOtherChange: (next: string) => void
  helperText?: string
}

export function SubjectChips<T extends string>({
  options,
  value,
  onChange,
  otherValue,
  onOtherChange,
  helperText
}: SubjectChipsProps<T>) {
  return (
    <div className="heur-fb-chips-block">
      {helperText && <p className="heur-fb-helper">{helperText}</p>}
      <div role="radiogroup" aria-label="Subject" className="heur-fb-chips">
        {options.map(opt => {
          const selected = value === opt.id
          return (
            <button
              type="button"
              key={opt.id}
              role="radio"
              aria-checked={selected}
              className={`heur-fb-chip ${selected ? 'heur-fb-chip-selected' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {value === ('other' as T) && (
        <div className="heur-fb-other">
          <label className="heur-fb-label">
            Briefly name the issue type
            <input
              type="text"
              value={otherValue}
              maxLength={MAX_SUBJECT_OTHER_CHARS}
              onChange={e => onOtherChange(e.target.value)}
              placeholder="e.g. Hover state regression"
              aria-label="Custom subject"
            />
            <span className="heur-fb-counter" aria-live="polite">
              {otherValue.length}/{MAX_SUBJECT_OTHER_CHARS}
            </span>
          </label>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Textarea field with min/max char enforcement
 * ───────────────────────────────────────────────────────────────── */

export type TextareaFieldProps = {
  label: string
  value: string
  onChange: (next: string) => void
  helperText?: string
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  rows?: number
}

export function TextareaField({
  label,
  value,
  onChange,
  helperText,
  placeholder,
  required,
  min = MIN_DESCRIPTION_CHARS,
  max = MAX_DESCRIPTION_CHARS,
  rows = 6
}: TextareaFieldProps) {
  const id = useId()
  const tooShort = value.length > 0 && value.length < min
  return (
    <div className="heur-fb-field">
      <label htmlFor={id} className="heur-fb-label-text">
        {label}
        {required && <span aria-hidden="true" className="heur-fb-req">*</span>}
      </label>
      {helperText && <p className="heur-fb-helper">{helperText}</p>}
      <div className="heur-fb-textarea-wrap">
        <textarea
          id={id}
          rows={rows}
          value={value}
          maxLength={max}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          aria-invalid={tooShort || undefined}
          aria-describedby={`${id}-counter`}
        />
        <span id={`${id}-counter`} className="heur-fb-counter" aria-live="polite">
          {value.length}/{max}
        </span>
      </div>
      {tooShort && (
        <p className="heur-fb-error">Please write at least {min} characters.</p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  URL field with on-blur validation
 * ───────────────────────────────────────────────────────────────── */

export type UrlFieldProps = {
  label: string
  value: string
  onChange: (next: string) => void
  helperText?: string
  placeholder?: string
}

export function UrlField({ label, value, onChange, helperText, placeholder }: UrlFieldProps) {
  const id = useId()
  const [touched, setTouched] = useState(false)
  const trimmed = value.trim()
  const invalid = touched && trimmed.length > 0 && !isValidHttpUrl(trimmed)
  const valid = trimmed.length > 0 && isValidHttpUrl(trimmed)

  return (
    <div className="heur-fb-field">
      <label htmlFor={id} className="heur-fb-label-text">
        {label}
      </label>
      {helperText && <p className="heur-fb-helper">{helperText}</p>}
      <div className={`heur-fb-url ${invalid ? 'heur-fb-url-invalid' : ''}`}>
        <input
          id={id}
          type="url"
          value={value}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder || 'https://…'}
          onBlur={() => setTouched(true)}
          onChange={e => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
        />
        {valid && (
          <a
            className="heur-fb-url-open"
            href={trimmed}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open link in a new tab"
          >
            ↗
          </a>
        )}
      </div>
      {invalid && (
        <p className="heur-fb-error">Please enter a valid http(s) URL or leave empty.</p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Screenshot dropzone
 * ───────────────────────────────────────────────────────────────── */

export type ScreenshotDropzoneProps = {
  label: string
  helperText?: string
  value: AttachedScreenshot | null
  onChange: (next: AttachedScreenshot | null) => void
}

export function ScreenshotDropzone({
  label,
  helperText,
  value,
  onChange
}: ScreenshotDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setDragOver] = useState(false)

  const ingest = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return
      setError(null)
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Only PNG, JPEG, or WebP images are accepted.')
        return
      }
      if (file.size > MAX_SCREENSHOT_BYTES) {
        setError(`Image is larger than ${formatBytes(MAX_SCREENSHOT_BYTES)}.`)
        return
      }
      try {
        const meta = await readImageMeta(file)
        if (meta.width > MAX_SCREENSHOT_DIM || meta.height > MAX_SCREENSHOT_DIM) {
          setError(`Image dimensions exceed ${MAX_SCREENSHOT_DIM}×${MAX_SCREENSHOT_DIM}px.`)
          return
        }
        onChange({
          file,
          dataUrl: meta.dataUrl,
          width: meta.width,
          height: meta.height,
          sizeBytes: file.size
        })
      } catch {
        setError('Could not read this image.')
      }
    },
    [onChange]
  )

  // Paste-to-attach support is wired by the parent step.
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) void ingest(file)
  }
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }
  const onDragLeave = () => setDragOver(false)

  return (
    <div className="heur-fb-field">
      <span className="heur-fb-label-text">{label}</span>
      {helperText && <p className="heur-fb-helper">{helperText}</p>}
      {value ? (
        <div className="heur-fb-attachment">
          <img
            src={value.dataUrl}
            alt="Screenshot preview"
            className="heur-fb-attachment-thumb"
          />
          <div className="heur-fb-attachment-meta">
            <div className="heur-fb-attachment-name" title={value.file.name}>
              {value.file.name}
            </div>
            <div className="heur-fb-attachment-sub">
              {value.width}×{value.height} · {formatBytes(value.sizeBytes)}
            </div>
            <button
              type="button"
              className="heur-fb-link-btn"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`heur-fb-dropzone ${isDragOver ? 'heur-fb-dropzone-over' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          aria-label="Add screenshot"
        >
          <div className="heur-fb-dropzone-icon" aria-hidden="true">
            ⬆
          </div>
          <div className="heur-fb-dropzone-text">
            Drop a screenshot here, paste from clipboard, or{' '}
            <span className="heur-fb-link">browse</span>
          </div>
          <div className="heur-fb-dropzone-meta">
            PNG, JPEG, or WebP · up to {formatBytes(MAX_SCREENSHOT_BYTES)} ·{' '}
            {MAX_SCREENSHOT_DIM}×{MAX_SCREENSHOT_DIM}px max
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={e => {
          void ingest(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {error && (
        <p className="heur-fb-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Hook helper: enable paste-to-attach anywhere a parent panel is mounted.
 * Wires a window-level paste listener while `enabled` is true.
 */
export function usePasteScreenshot(
  enabled: boolean,
  onFile: (file: File) => void
) {
  useEffect(() => {
    if (!enabled) return
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            onFile(file)
            e.preventDefault()
            return
          }
        }
      }
    }
    window.addEventListener('paste', onPaste as EventListener)
    return () => window.removeEventListener('paste', onPaste as EventListener)
  }, [enabled, onFile])
}

/* ─────────────────────────────────────────────────────────────────
 *  Discard-confirmation popover
 * ───────────────────────────────────────────────────────────────── */

export function DiscardConfirm({
  message,
  onKeepEditing,
  onDiscard
}: {
  message: string
  onKeepEditing: () => void
  onDiscard: () => void
}) {
  const keepRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    keepRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onKeepEditing()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onKeepEditing])

  return (
    <div className="heur-fb-discard" role="alertdialog" aria-modal="true">
      <div className="heur-fb-discard-card" onMouseDown={e => e.stopPropagation()}>
        <p className="heur-fb-discard-msg">{message}</p>
        <div className="heur-fb-discard-actions">
          <button ref={keepRef} type="button" className="heur-fb-btn-ghost" onClick={onKeepEditing}>
            Keep editing
          </button>
          <button type="button" className="heur-fb-btn-danger" onClick={onDiscard}>
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Submit-error banner
 * ───────────────────────────────────────────────────────────────── */

export function SubmitErrorBanner({ message }: { message: string }) {
  return (
    <div className="heur-fb-error-banner" role="alert">
      <strong>Couldn’t submit:</strong> {message}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Scoped styles
 *
 *  Mounted inside the modal once. Uses the host app's --lb-* and
 *  --text-* CSS variables so we never hard-code palette hex values.
 * ───────────────────────────────────────────────────────────────── */

function FeedbackSharedStyles() {
  return (
    <style>{`
      .heur-fb-overlay {
        position: fixed; inset: 0;
        background: color-mix(in srgb, var(--lb-pearl, #0b1014) 55%, transparent);
        display: flex; align-items: center; justify-content: center;
        padding: 24px; z-index: 9000;
      }
      .heur-fb-modal {
        background: var(--lb-white, #fff);
        color: var(--text-1, var(--lb-pearl, #0b1014));
        width: 720px; max-width: 100%; max-height: 90vh;
        border-radius: 14px;
        border: 1px solid var(--lb-athens, #dbdee1);
        box-shadow: 0 24px 60px -10px rgba(11,16,20,.35), 0 8px 24px -8px rgba(11,16,20,.25);
        display: flex; flex-direction: column;
        font: 14px/1.45 -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
      }
      .heur-fb-topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px; border-bottom: 1px solid var(--lb-athens, #dbdee1);
      }
      .heur-fb-title {
        margin: 0; font-size: 16px; font-weight: 600;
        color: var(--lb-ebony, #252e36);
        letter-spacing: -0.005em;
      }
      .heur-fb-close {
        background: transparent; border: none; cursor: pointer;
        font-size: 22px; line-height: 1; padding: 4px 8px; border-radius: 6px;
        color: var(--lb-raven, #6b7379);
      }
      .heur-fb-close:hover { background: var(--lb-athens-soft, #ecedf0); color: var(--lb-pearl, #0b1014); }

      .heur-fb-stepper-row {
        padding: 12px 20px; border-bottom: 1px solid var(--lb-athens-soft, #ecedf0);
        background: var(--lb-athens-soft, #ecedf0);
      }
      .heur-fb-stepper { display: flex; gap: 8px; margin: 0; padding: 0; list-style: none; flex-wrap: wrap; }
      .heur-fb-step {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 12px; border-radius: 999px;
        background: var(--lb-white, #fff);
        border: 1px solid var(--lb-athens, #dbdee1);
        font-size: 12px; color: var(--lb-raven, #6b7379);
      }
      .heur-fb-step-num {
        display: inline-flex; align-items: center; justify-content: center;
        width: 18px; height: 18px; border-radius: 999px;
        background: var(--lb-athens, #dbdee1); color: var(--lb-ebony, #252e36);
        font-size: 11px; font-weight: 600;
      }
      .heur-fb-step-active {
        background: var(--lb-pearl, #0b1014); color: var(--lb-white, #fff);
        border-color: var(--lb-pearl, #0b1014);
      }
      .heur-fb-step-active .heur-fb-step-num {
        background: var(--lb-chartreuse, #dbff00); color: var(--lb-pearl, #0b1014);
      }
      .heur-fb-step-done { background: var(--lb-white, #fff); color: var(--lb-arsenic, #3d454d); border-color: var(--lb-athens, #dbdee1); }
      .heur-fb-step-done .heur-fb-step-num { background: var(--lb-arsenic, #3d454d); color: var(--lb-white, #fff); }

      .heur-fb-body {
        padding: 20px; overflow: auto; flex: 1; min-height: 240px;
      }
      .heur-fb-footer {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px; padding: 12px 20px;
        border-top: 1px solid var(--lb-athens, #dbdee1);
        background: var(--lb-white, #fff);
        border-radius: 0 0 14px 14px;
      }
      .heur-fb-footer-side { display: flex; align-items: center; gap: 8px; }

      .heur-fb-helper { margin: 0 0 12px; color: var(--lb-raven, #6b7379); font-size: 13px; }
      .heur-fb-empty { color: var(--lb-raven, #6b7379); font-size: 13px; padding: 8px; }
      .heur-fb-error { margin: 6px 0 0; color: #b21f3a; font-size: 12px; }
      .heur-fb-error-banner {
        background: #fff1f2; color: #99172e; border: 1px solid #fecdd3;
        border-radius: 8px; padding: 8px 12px; font-size: 13px;
        margin: 0 20px 12px;
      }
      .heur-fb-locked-banner {
        background: var(--lb-athens-soft, #ecedf0);
        border: 1px solid var(--lb-athens, #dbdee1);
        border-radius: 8px; padding: 10px 12px;
        color: var(--lb-arsenic, #3d454d); font-size: 13px;
      }

      /* Tiles */
      .heur-fb-search input {
        width: 100%; padding: 9px 12px; font-size: 13px;
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 8px;
        background: var(--lb-white, #fff); color: var(--lb-pearl, #0b1014);
        margin-bottom: 12px;
      }
      .heur-fb-search input:focus {
        outline: 2px solid var(--lb-chartreuse, #dbff00); outline-offset: -1px;
      }
      .heur-fb-tile-row {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 8px; margin-bottom: 8px;
      }
      .heur-fb-tile-row-synthetic { grid-template-columns: 1fr 1fr; margin-bottom: 16px; }
      @media (max-width: 880px) { .heur-fb-tile-row { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 520px) {
        .heur-fb-tile-row, .heur-fb-tile-row-synthetic { grid-template-columns: 1fr; }
        .heur-fb-modal { max-height: 100vh; height: 100vh; border-radius: 0; }
      }
      .heur-fb-tile {
        display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
        text-align: left; gap: 4px;
        height: 96px; padding: 12px 14px;
        background: var(--lb-white, #fff);
        border: 1px solid var(--lb-athens, #dbdee1);
        border-radius: 10px; cursor: pointer;
        font-size: 13px; color: var(--lb-pearl, #0b1014);
        transition: background .12s ease, border-color .12s ease, box-shadow .12s ease;
      }
      .heur-fb-tile:hover { background: var(--lb-athens-soft, #ecedf0); }
      .heur-fb-tile-selected {
        background: var(--lb-chartreuse-tint, #fcffd6);
        border-color: var(--lb-pearl, #0b1014);
        box-shadow: inset 0 0 0 1px var(--lb-pearl, #0b1014);
      }
      .heur-fb-tile-label { font-weight: 600; }
      .heur-fb-tile-hint { font-size: 11px; color: var(--lb-raven, #6b7379); font-weight: 400; }
      .heur-fb-tile-synthetic {
        background: var(--lb-athens-soft, #ecedf0);
        border-style: dashed;
      }
      .heur-fb-tile-synthetic.heur-fb-tile-selected {
        background: var(--lb-chartreuse-tint, #fcffd6);
        border-style: solid;
      }

      .heur-fb-group { border: 0; padding: 0; margin: 16px 0 0; }
      .heur-fb-group-legend {
        font-size: 11px; text-transform: uppercase; letter-spacing: .08em;
        color: var(--lb-chateau, #9ca3a8);
        margin-bottom: 8px; padding: 0;
      }

      /* Chips */
      .heur-fb-chips-block { }
      .heur-fb-chips { display: flex; flex-wrap: wrap; gap: 8px; }
      .heur-fb-chip {
        height: 36px; padding: 0 14px; border-radius: 999px;
        background: var(--lb-white, #fff);
        border: 1px solid var(--lb-athens, #dbdee1);
        font-size: 13px; color: var(--lb-arsenic, #3d454d);
        cursor: pointer;
      }
      .heur-fb-chip:hover { background: var(--lb-athens-soft, #ecedf0); }
      .heur-fb-chip-selected {
        background: var(--lb-chartreuse-tint, #fcffd6);
        border-color: var(--lb-pearl, #0b1014);
        color: var(--lb-pearl, #0b1014);
        box-shadow: inset 0 0 0 1px var(--lb-pearl, #0b1014);
      }
      .heur-fb-other { margin-top: 12px; max-width: 420px; }
      .heur-fb-label { display: block; font-size: 12px; color: var(--lb-arsenic, #3d454d); }
      .heur-fb-label input {
        width: 100%; padding: 9px 12px; margin-top: 4px;
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 8px;
        background: var(--lb-white, #fff); color: var(--lb-pearl, #0b1014);
        font-size: 13px;
      }
      .heur-fb-counter {
        font-size: 11px; color: var(--lb-chateau, #9ca3a8); display: inline-block; margin-top: 4px;
      }

      /* Field block */
      .heur-fb-field { margin-bottom: 18px; }
      .heur-fb-label-text {
        display: block; font-size: 13px; font-weight: 600;
        color: var(--lb-ebony, #252e36); margin-bottom: 4px;
      }
      .heur-fb-req { color: #b21f3a; margin-left: 4px; }
      .heur-fb-textarea-wrap { position: relative; }
      .heur-fb-textarea-wrap textarea {
        width: 100%; padding: 10px 12px;
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 8px;
        background: var(--lb-white, #fff); color: var(--lb-pearl, #0b1014);
        font: inherit; resize: vertical; min-height: 96px;
      }
      .heur-fb-textarea-wrap textarea:focus {
        outline: 2px solid var(--lb-chartreuse, #dbff00); outline-offset: -1px;
      }
      .heur-fb-textarea-wrap .heur-fb-counter {
        position: absolute; right: 8px; bottom: 6px; background: var(--lb-white, #fff); padding: 0 4px;
      }

      /* URL field */
      .heur-fb-url { position: relative; display: flex; align-items: stretch; }
      .heur-fb-url input {
        flex: 1; padding: 9px 12px;
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 8px;
        background: var(--lb-white, #fff); color: var(--lb-pearl, #0b1014);
        font: inherit;
      }
      .heur-fb-url input:focus {
        outline: 2px solid var(--lb-chartreuse, #dbff00); outline-offset: -1px;
      }
      .heur-fb-url-invalid input { border-color: #b21f3a; }
      .heur-fb-url-open {
        align-self: center; margin-left: 8px;
        text-decoration: none; color: var(--lb-arsenic, #3d454d);
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 8px;
        padding: 4px 10px; font-size: 14px;
      }

      /* Dropzone */
      .heur-fb-dropzone {
        border: 1.5px dashed var(--lb-athens, #dbdee1);
        border-radius: 12px; padding: 22px;
        text-align: center; cursor: pointer;
        background: var(--lb-athens-soft, #ecedf0);
        color: var(--lb-arsenic, #3d454d);
        min-height: 160px;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      }
      .heur-fb-dropzone-over {
        border-color: var(--lb-pearl, #0b1014);
        background: var(--lb-chartreuse-tint, #fcffd6);
      }
      .heur-fb-dropzone-icon { font-size: 24px; color: var(--lb-arsenic, #3d454d); }
      .heur-fb-dropzone-meta { font-size: 11px; color: var(--lb-chateau, #9ca3a8); }
      .heur-fb-link { color: var(--lb-pearl, #0b1014); font-weight: 600; text-decoration: underline; }
      .heur-fb-link-btn {
        background: transparent; border: none; padding: 0; cursor: pointer;
        color: var(--lb-arsenic, #3d454d); text-decoration: underline; font-size: 12px;
      }

      .heur-fb-attachment {
        display: flex; gap: 12px; align-items: center;
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 12px;
        padding: 12px; background: var(--lb-white, #fff);
      }
      .heur-fb-attachment-thumb {
        width: 96px; height: 64px; object-fit: cover; border-radius: 8px;
        background: var(--lb-athens, #dbdee1);
      }
      .heur-fb-attachment-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .heur-fb-attachment-name { font-size: 13px; font-weight: 600; color: var(--lb-pearl, #0b1014); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .heur-fb-attachment-sub { font-size: 11px; color: var(--lb-chateau, #9ca3a8); }

      /* Buttons */
      .heur-fb-btn-primary, .heur-fb-btn-ghost, .heur-fb-btn-danger {
        height: 36px; padding: 0 16px; border-radius: 8px; font-size: 13px;
        cursor: pointer; border: 1px solid transparent;
      }
      .heur-fb-btn-primary {
        background: var(--lb-pearl, #0b1014); color: var(--lb-white, #fff);
        font-weight: 600;
      }
      .heur-fb-btn-primary:hover { background: var(--lb-ebony, #252e36); }
      .heur-fb-btn-primary:disabled { background: var(--lb-athens, #dbdee1); color: var(--lb-chateau, #9ca3a8); cursor: not-allowed; }
      .heur-fb-btn-ghost {
        background: var(--lb-white, #fff); color: var(--lb-arsenic, #3d454d);
        border-color: var(--lb-athens, #dbdee1);
      }
      .heur-fb-btn-ghost:hover { background: var(--lb-athens-soft, #ecedf0); }
      .heur-fb-btn-danger { background: #b21f3a; color: var(--lb-white, #fff); font-weight: 600; }
      .heur-fb-btn-danger:hover { background: #99172e; }

      /* Discard popover */
      .heur-fb-discard {
        position: fixed; inset: 0;
        background: rgba(11,16,20,.35);
        display: flex; align-items: center; justify-content: center;
        z-index: 9100;
      }
      .heur-fb-discard-card {
        background: var(--lb-white, #fff);
        border-radius: 12px; padding: 18px;
        min-width: 320px; max-width: 420px;
        border: 1px solid var(--lb-athens, #dbdee1);
        box-shadow: 0 24px 60px -10px rgba(11,16,20,.35);
      }
      .heur-fb-discard-msg { margin: 0 0 14px; font-size: 14px; color: var(--lb-pearl, #0b1014); }
      .heur-fb-discard-actions { display: flex; gap: 8px; justify-content: flex-end; }

      .heur-fb-footer-note {
        font-size: 11px; color: var(--lb-chateau, #9ca3a8); padding: 0 20px 14px;
      }

      /* Review summary */
      .heur-fb-review-card {
        border: 1px solid var(--lb-athens, #dbdee1); border-radius: 12px; padding: 14px;
        background: var(--lb-white, #fff);
      }
      .heur-fb-review-row { display: flex; gap: 12px; padding: 8px 0; }
      .heur-fb-review-row + .heur-fb-review-row { border-top: 1px dashed var(--lb-athens-soft, #ecedf0); }
      .heur-fb-review-label { width: 130px; flex-shrink: 0; color: var(--lb-chateau, #9ca3a8); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
      .heur-fb-review-value { flex: 1; color: var(--lb-pearl, #0b1014); font-size: 13px; word-break: break-word; }
      .heur-fb-review-empty { color: var(--lb-chateau, #9ca3a8); font-style: italic; }
    `}</style>
  )
}
