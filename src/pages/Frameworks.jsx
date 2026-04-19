import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Layers, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const CATEGORIES = ['product', 'design', 'engineering', 'strategy', 'hiring', 'other'];

const categoryColors = {
  product: 'bg-blue-50 text-blue-700',
  design: 'bg-purple-50 text-purple-700',
  engineering: 'bg-emerald-50 text-emerald-700',
  strategy: 'bg-amber-50 text-amber-700',
  hiring: 'bg-rose-50 text-rose-700',
  other: 'bg-gray-50 text-gray-700',
};

export default function Frameworks() {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'product' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Framework.list('-created_date').then(data => {
      setFrameworks(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    await base44.entities.Framework.create({ ...form, status: 'draft' });
    setSaving(false);
    setShowNew(false);
    setForm({ title: '', description: '', category: 'product' });
    load();
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await base44.entities.Framework.delete(id);
    setFrameworks(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Frameworks</h1>
          <p className="text-sm text-muted-foreground mt-1">Build and manage your decision criteria sets.</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)}>
          <Plus size={14} className="mr-1.5" /> New Framework
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : frameworks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <Layers size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No frameworks yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first decision framework to get started.</p>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus size={14} className="mr-1.5" />New Framework</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {frameworks.map(fw => (
            <Link key={fw.id} to={`/frameworks/${fw.id}`}
              className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 hover:shadow-sm transition-all group flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-accent rounded-lg mt-0.5">
                  <Layers size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{fw.title}</p>
                  {fw.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{fw.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[fw.category] || categoryColors.other}`}>
                      {fw.category}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fw.status === 'active' ? 'bg-green-50 text-green-700' : fw.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700'}`}>
                      {fw.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(fw.id, e)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={13} />
                </button>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Framework Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Framework</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. Feature Prioritization" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea placeholder="What decisions does this framework help make?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title || saving}>
              {saving ? 'Creating…' : 'Create Framework'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}