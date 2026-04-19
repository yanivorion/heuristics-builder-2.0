import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Layers, ClipboardCheck, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [frameworks, setFrameworks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Framework.list('-created_date', 5),
      base44.entities.Evaluation.list('-created_date', 5),
    ]).then(([fw, ev]) => {
      setFrameworks(fw);
      setEvaluations(ev);
      setLoading(false);
    });
  }, []);

  const activeFrameworks = frameworks.filter(f => f.status === 'active').length;
  const completedEvaluations = evaluations.filter(e => e.status === 'completed').length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your decision frameworks at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <StatCard
          label="Frameworks"
          value={loading ? '—' : frameworks.length}
          sub={`${activeFrameworks} active`}
          icon={Layers}
          to="/frameworks"
        />
        <StatCard
          label="Evaluations"
          value={loading ? '—' : evaluations.length}
          sub={`${completedEvaluations} completed`}
          icon={ClipboardCheck}
          to="/evaluations"
        />
      </div>

      {/* Recent Frameworks */}
      <Section title="Recent Frameworks" to="/frameworks" ctaLabel="All frameworks">
        {loading ? (
          <Skeleton />
        ) : frameworks.length === 0 ? (
          <EmptyState
            label="No frameworks yet"
            action={<Link to="/frameworks"><Button size="sm" variant="outline"><Plus size={14} className="mr-1.5" />New Framework</Button></Link>}
          />
        ) : (
          <ul className="divide-y divide-border">
            {frameworks.map(fw => (
              <li key={fw.id}>
                <Link to={`/frameworks/${fw.id}`} className="flex items-center justify-between py-3 group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{fw.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{fw.category} · {fw.status}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Recent Evaluations */}
      <Section title="Recent Evaluations" to="/evaluations" ctaLabel="All evaluations">
        {loading ? (
          <Skeleton />
        ) : evaluations.length === 0 ? (
          <EmptyState label="No evaluations yet" />
        ) : (
          <ul className="divide-y divide-border">
            {evaluations.map(ev => (
              <li key={ev.id}>
                <Link to={`/evaluations/${ev.id}`} className="flex items-center justify-between py-3 group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{ev.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.subject} · <span className="capitalize">{ev.status?.replace('_', ' ')}</span></p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ev.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {ev.status === 'completed' ? 'Done' : 'In Progress'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, to }) {
  return (
    <Link to={to} className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-semibold text-foreground mt-2">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
        <div className="p-2.5 bg-accent rounded-lg group-hover:bg-primary/10 transition-colors">
          <Icon size={16} className="text-primary" />
        </div>
      </div>
    </Link>
  );
}

function Section({ title, to, ctaLabel, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Link to={to} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          {ctaLabel} <ArrowRight size={12} />
        </Link>
      </div>
      <div className="border border-border rounded-xl bg-card px-4">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ label, action }) {
  return (
    <div className="py-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      {action}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="py-4 space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
      ))}
    </div>
  );
}