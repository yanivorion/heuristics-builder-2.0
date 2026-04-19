import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, Check, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const WEIGHT_LABELS = { 1: 'Low', 2: 'Below avg', 3: 'Average', 4: 'High', 5: 'Critical' };
const STATUS_OPTS = ['draft', 'active', 'archived'];

export default function FrameworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [framework, setFramework] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFw, setEditingFw] = useState(false);
  const [fwForm, setFwForm] = useState({});
  const [newCriterion, setNewCriterion] = useState({ title: '', description: '', weight: 3, guidance: '' });
  const [addingCriterion, setAddingCriterion] = useState(false);
  const [savingCriterion, setSavingCriterion] = useState(false);
  const [editingCriterionId, setEditingCriterionId] = useState(null);

  const load = async () => {
    const [fw, crit] = await Promise.all([
      base44.entities.Framework.filter({ id }),
      base44.entities.Criterion.filter({ framework_id: id }, 'order'),
    ]);
    setFramework(fw[0]);
    setFwForm(fw[0] || {});
    setCriteria(crit);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const saveFw = async () => {
    await base44.entities.Framework.update(id, { title: fwForm.title, description: fwForm.description, status: fwForm.status, category: fwForm.category });
    setFramework({ ...framework, ...fwForm });
    setEditingFw(false);
  };

  const addCriterion = async () => {
    setSavingCriterion(true);
    const c = await base44.entities.Criterion.create({ ...newCriterion, framework_id: id, order: criteria.length });
    setCriteria(prev => [...prev, c]);
    setNewCriterion({ title: '', description: '', weight: 3, guidance: '' });
    setAddingCriterion(false);
    setSavingCriterion(false);
  };

  const deleteCriterion = async (cid) => {
    await base44.entities.Criterion.delete(cid);
    setCriteria(prev => prev.filter(c => c.id !== cid));
  };

  const updateCriterion = async (cid, data) => {
    await base44.entities.Criterion.update(cid, data);
    setCriteria(prev => prev.map(c => c.id === cid ? { ...c, ...data } : c));
    setEditingCriterionId(null);
  };

  if (loading) return <div className="p-8"><div className="h-8 w-48 bg-muted rounded animate-pulse" /></div>;
  if (!framework) return <div className="p-8 text-sm text-muted-foreground">Framework not found. <Link to="/frameworks" className="underline">Go back</Link></div>;

  const statusColor = { draft: 'bg-amber-50 text-amber-700', active: 'bg-green-50 text-green-700', archived: 'bg-gray-100 text-gray-500' };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link to="/frameworks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} /> Frameworks
      </Link>

      {/* Framework Header */}
      {editingFw ? (
        <div className="border border-border rounded-xl p-5 mb-8 space-y-4">
          <div className="space-y-1.5"><Label>Title</Label><Input value={fwForm.title} onChange={e => setFwForm({...fwForm, title: e.target.value})} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea value={fwForm.description || ''} onChange={e => setFwForm({...fwForm, description: e.target.value})} rows={2} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={fwForm.status} onValueChange={v => setFwForm({...fwForm, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS_OPTS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={fwForm.category} onValueChange={v => setFwForm({...fwForm, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['product','design','engineering','strategy','hiring','other'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={saveFw}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditingFw(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">{framework.title}</h1>
              {framework.description && <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>}
              <div className="flex gap-2 mt-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor[framework.status]}`}>{framework.status}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{framework.category}</span>
              </div>
            </div>
            <button onClick={() => setEditingFw(true)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <Pencil size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Criteria */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Criteria <span className="text-muted-foreground font-normal">({criteria.length})</span></h2>
        <Button size="sm" variant="outline" onClick={() => setAddingCriterion(true)}>
          <Plus size={13} className="mr-1.5" /> Add Criterion
        </Button>
      </div>

      {criteria.length === 0 && !addingCriterion && (
        <div className="border border-dashed border-border rounded-xl py-10 text-center">
          <p className="text-sm text-muted-foreground">No criteria yet.</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Add the rules or questions that define this framework.</p>
          <Button size="sm" variant="outline" onClick={() => setAddingCriterion(true)}><Plus size={13} className="mr-1.5" />Add Criterion</Button>
        </div>
      )}

      <div className="space-y-2">
        {criteria.map(c => (
          <CriterionRow
            key={c.id}
            criterion={c}
            isEditing={editingCriterionId === c.id}
            onEdit={() => setEditingCriterionId(c.id)}
            onSave={(data) => updateCriterion(c.id, data)}
            onCancel={() => setEditingCriterionId(null)}
            onDelete={() => deleteCriterion(c.id)}
          />
        ))}

        {/* Add new criterion inline */}
        {addingCriterion && (
          <div className="border border-primary/30 rounded-xl p-4 bg-accent/30 space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Title *</Label>
              <Input placeholder="e.g. Does it solve a real user problem?" value={newCriterion.title} onChange={e => setNewCriterion({...newCriterion, title: e.target.value})} className="text-sm" />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe or elaborate this criterion…" value={newCriterion.description} onChange={e => setNewCriterion({...newCriterion, description: e.target.value})} rows={2} className="text-sm" />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Guidance (optional)</Label>
              <Input placeholder="Examples or scoring hints" value={newCriterion.guidance} onChange={e => setNewCriterion({...newCriterion, guidance: e.target.value})} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Weight — {WEIGHT_LABELS[newCriterion.weight]}</Label>
              <input type="range" min={1} max={5} value={newCriterion.weight} onChange={e => setNewCriterion({...newCriterion, weight: +e.target.value})} className="w-full accent-primary" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addCriterion} disabled={!newCriterion.title || savingCriterion}>{savingCriterion ? 'Adding…' : 'Add'}</Button>
              <Button size="sm" variant="outline" onClick={() => setAddingCriterion(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {criteria.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <Link to={`/evaluations/new?framework=${id}`}>
            <Button>Run Evaluation</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function CriterionRow({ criterion, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({ title: criterion.title, description: criterion.description || '', guidance: criterion.guidance || '', weight: criterion.weight || 3 });

  if (isEditing) {
    return (
      <div className="border border-primary/30 rounded-xl p-4 bg-accent/30 space-y-3">
        <div className="space-y-1.5"><Label className="text-xs">Title</Label>
          <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="text-sm" />
        </div>
        <div className="space-y-1.5"><Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="text-sm" />
        </div>
        <div className="space-y-1.5"><Label className="text-xs">Guidance</Label>
          <Input value={form.guidance} onChange={e => setForm({...form, guidance: e.target.value})} className="text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Weight — {WEIGHT_LABELS[form.weight]}</Label>
          <input type="range" min={1} max={5} value={form.weight} onChange={e => setForm({...form, weight: +e.target.value})} className="w-full accent-primary" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSave(form)}>Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl p-4 bg-card hover:border-primary/20 transition-all group flex items-start gap-3">
      <GripVertical size={14} className="text-muted-foreground mt-0.5 flex-shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{criterion.title}</p>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
            w: {criterion.weight || 3}
          </span>
        </div>
        {criterion.description && <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>}
        {criterion.guidance && <p className="text-xs text-primary/70 mt-1 italic">💡 {criterion.guidance}</p>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"><Pencil size={12} /></button>
        <button onClick={onDelete} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={12} /></button>
      </div>
    </div>
  );
}