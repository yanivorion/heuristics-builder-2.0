import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CSV_HEADERS = ['rule_id', 'category', 'when', 'in', 'if', 'action', 'parameters', 'summary', 'priority', 'status', 'note', 'type'];

function escapeCSV(val) {
  const s = val == null ? '' : String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function rowsToCSV(rows, type) {
  const lines = [CSV_HEADERS.join(',')];
  for (const row of rows) {
    lines.push(CSV_HEADERS.map(h => {
      if (h === 'type') return escapeCSV(type);
      return escapeCSV(row[h]);
    }).join(','));
  }
  return lines.join('\n');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const main = await base44.entities.Heuristic.list('rule_id');
    const header = await base44.entities.HeaderHeuristic.list('rule_id');

    const csv = rowsToCSV(main, 'main') + '\n' + rowsToCSV(header, 'header');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=heuristics.csv'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});