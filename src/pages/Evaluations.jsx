import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, ClipboardCheck, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Evaluations() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', notes: '', framework_id: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([
      base44.entities.Evaluation.list('-created_date'),
      base44.entities.Framework.filter({ status: 'active' }),
    ]).then(([ev, fw]) => {
      setEvaluations(ev);
      setFrameworks(fw);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    const ev = await base44.entities.Evaluation.create({ ...form, status: 'in_progress', scores: [] });
    setSaving(false);
    setShowNew(false);
    navigate(`/evaluations/${ev.id}`);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await base44.entities.Evaluation.delete(id);
    setEvaluations(prev => prev.filter(e => e.id !== id));
  };

  const fwMap = frameworks.reduce((acc, fw) => { acc[fw.id] = fw; return acc; }, {});

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">Apply frameworks to real decisions.</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)}>
          <Plus size={14} className="mr-1.5" /> New Evaluation
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : evaluations.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <ClipboardCheck size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No evaluations yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Start a new evaluation using one of your active frameworks.</p>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus size={14} className="mr-1.5" />New Evaluation</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {evaluations.map(ev => {
            const fw = fwMap[ev.framework_id];
            return (
              <Link key={ev.id} to={`/evaluations/${ev.id}`}
                className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 hover:shadow-sm transition-all group flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-accent rounded-lg mt-0.5">
                    <ClipboardCheck size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{ev.title}</p>
                    {ev.subject && <p className="text-xs text-muted-foreground mt-0.5">{ev.subject}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      {fw && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{fw.title}</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ev.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {ev.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                      {ev.total_score != null && (
                        <span className="text-xs font-semibold text-foreground">Score: {ev.total_score.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => handleDelete(ev.id, e)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={13} />
                  </button>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Evaluation</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Framework</Label>
              <Select value={form.framework_id} onValueChange={v => setForm({...form, framework_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select a framework…" /></SelectTrigger>
                <SelectContent>
                  {frameworks.map(fw => <SelectItem key={fw.id} value={fw.id}>{fw.title}</SelectItem>)}
                </SelectContent>
              </Select>
              {frameworks.length === 0 && <p className="text-xs text-muted-foreground">No active frameworks. <Link to="/frameworks" className="text-primary underline">Create one first.</Link></p>}
            </div>
            <div className="space-y-1.5">
              <Label>Evaluation Title</Label>
              <Input placeholder="e.g. Q2 Feature Review" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Subject <span className="text-muted-foreground font-normal">(what you're evaluating)</span></Label>
              <Input placeholder="e.g. Dark mode feature, John Doe, Proposal A" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea placeholder="Context, constraints…" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title || !form.framework_id || saving}>
              {saving ? 'Creating…' : 'Start Evaluation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}