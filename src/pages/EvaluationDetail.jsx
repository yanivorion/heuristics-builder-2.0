import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const WEIGHT_LABELS = { 1: 'Low', 2: 'Below avg', 3: 'Average', 4: 'High', 5: 'Critical' };
const SCORE_LABELS = { 1: 'Poor', 2: 'Below avg', 3: 'Average', 4: 'Good', 5: 'Excellent' };

export default function EvaluationDetail() {
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [framework, setFramework] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [evArr] = await Promise.all([base44.entities.Evaluation.filter({ id })]);
      const ev = evArr[0];
      if (!ev) { setLoading(false); return; }
      setEvaluation(ev);

      const [fw, crit] = await Promise.all([
        base44.entities.Framework.filter({ id: ev.framework_id }),
        base44.entities.Criterion.filter({ framework_id: ev.framework_id }, 'order'),
      ]);
      setFramework(fw[0]);
      setCriteria(crit);

      // Initialize scores from saved data
      const scoreMap = {};
      const noteMap = {};
      (ev.scores || []).forEach(s => {
        scoreMap[s.criterion_id] = s.score;
        noteMap[s.criterion_id] = s.note || '';
      });
      setScores(scoreMap);
      setNotes(noteMap);
      setLoading(false);
    };
    load();
  }, [id]);

  const computeTotal = () => {
    let weightedSum = 0, totalWeight = 0;
    criteria.forEach(c => {
      const s = scores[c.id];
      if (s != null) {
        const w = c.weight || 3;
        weightedSum += s * w;
        totalWeight += w;
      }
    });
    return totalWeight > 0 ? weightedSum / totalWeight : null;
  };

  const handleSave = async (complete = false) => {
    setSaving(true);
    const scoresArr = criteria.map(c => ({
      criterion_id: c.id,
      score: scores[c.id] ?? null,
      note: notes[c.id] || '',
    })).filter(s => s.score != null);

    const total = computeTotal();
    await base44.entities.Evaluation.update(id, {
      scores: scoresArr,
      total_score: total,
      status: complete ? 'completed' : 'in_progress',
    });
    setEvaluation(prev => ({ ...prev, scores: scoresArr, total_score: total, status: complete ? 'completed' : 'in_progress' }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const answeredCount = criteria.filter(c => scores[c.id] != null).length;
  const progress = criteria.length > 0 ? (answeredCount / criteria.length) * 100 : 0;
  const total = computeTotal();

  if (loading) return <div className="p-8"><div className="h-8 w-48 bg-muted rounded animate-pulse" /></div>;
  if (!evaluation) return <div className="p-8 text-sm text-muted-foreground">Evaluation not found. <Link to="/evaluations" className="underline">Go back</Link></div>;

  const isCompleted = evaluation.status === 'completed';

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/evaluations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} /> Evaluations
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{evaluation.title}</h1>
            {evaluation.subject && <p className="text-sm text-muted-foreground mt-1">Evaluating: <span className="font-medium text-foreground">{evaluation.subject}</span></p>}
            {framework && (
              <p className="text-xs text-muted-foreground mt-1">
                Framework: <Link to={`/frameworks/${framework.id}`} className="text-primary hover:underline">{framework.title}</Link>
              </p>
            )}
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <CheckCircle2 size={14} /> Completed
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{answeredCount} of {criteria.length} scored</span>
            {total != null && <span className="font-semibold text-foreground">Weighted Score: {total.toFixed(2)} / 5</span>}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Score cards */}
      <div className="space-y-3 mb-8">
        {criteria.map((c, idx) => (
          <CriterionScorer
            key={c.id}
            criterion={c}
            index={idx + 1}
            score={scores[c.id]}
            note={notes[c.id] || ''}
            disabled={isCompleted}
            onScore={val => setScores(prev => ({ ...prev, [c.id]: val }))}
            onNote={val => setNotes(prev => ({ ...prev, [c.id]: val }))}
          />
        ))}
      </div>

      {/* Actions */}
      {!isCompleted && (
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving}>
            <Save size={13} className="mr-1.5" />
            {saved ? 'Saved!' : 'Save Draft'}
          </Button>
          <Button size="sm" onClick={() => handleSave(true)} disabled={saving || answeredCount === 0}>
            <CheckCircle2 size={13} className="mr-1.5" />
            Complete Evaluation
          </Button>
        </div>
      )}

      {isCompleted && total != null && (
        <div className="mt-6 border border-border rounded-xl p-6 bg-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Final Weighted Score</p>
          <p className="text-5xl font-bold text-foreground">{total.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">out of 5.00</p>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(total / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CriterionScorer({ criterion, index, score, note, disabled, onScore, onNote }) {
  const [showNote, setShowNote] = useState(!!note);

  return (
    <div className={`border rounded-xl p-5 transition-all ${score != null ? 'border-primary/30 bg-accent/20' : 'border-border bg-card'}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xs font-semibold text-muted-foreground bg-muted w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{index}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{criterion.title}</p>
          {criterion.description && <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>}
          {criterion.guidance && <p className="text-xs text-primary/60 mt-1 italic">💡 {criterion.guidance}</p>}
          <p className="text-xs text-muted-foreground mt-1">Weight: <span className="font-medium">{WEIGHT_LABELS[criterion.weight || 3]}</span></p>
        </div>
      </div>

      {/* Score buttons */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            disabled={disabled}
            onClick={() => onScore(score === val ? null : val)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
              score === val
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            } ${disabled ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
          >
            {val}
            <span className="block text-[9px] font-normal leading-tight">{SCORE_LABELS[val]}</span>
          </button>
        ))}
      </div>

      {!disabled && (
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowNote(!showNote)}
        >
          {showNote ? '− Hide note' : '+ Add note'}
        </button>
      )}

      {(showNote || note) && (
        <Textarea
          className="mt-2 text-xs"
          placeholder="Add a note about this score…"
          value={note}
          disabled={disabled}
          onChange={e => onNote(e.target.value)}
          rows={2}
        />
      )}
    </div>
  );
}