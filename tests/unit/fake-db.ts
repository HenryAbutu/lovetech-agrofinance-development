// Minimal in-memory stand-in for the admin database client used by payment code.
type Row = Record<string, unknown>;
export function createFakeDb(seed: Record<string, Row[]>) {
  const tables = structuredClone(seed);
  const log: { table: string; op: string; patch?: Row }[] = [];
  function from(table: string) {
    const filters: ((r: Row) => boolean)[] = [];
    let op: "select" | "update" = "select";
    let patch: Row = {};
    let returning = false;
    const rows = () => (tables[table] ??= []).filter((r) => filters.every((f) => f(r)));
    const run = () => {
      if (op === "update") {
        const hit = rows();
        hit.forEach((r) => Object.assign(r, patch));
        log.push({ table, op, patch });
        return { data: returning ? hit.map((r) => ({ ...r })) : null, error: null };
      }
      return { data: rows(), error: null };
    };
    const q = {
      select() { if (op === "update") returning = true; return q; },
      update(p: Row) { op = "update"; patch = p; return q; },
      eq(c: string, v: unknown) { filters.push((r) => r[c] === v); return q; },
      neq(c: string, v: unknown) { filters.push((r) => r[c] !== v); return q; },
      maybeSingle() { const d = run().data as Row[]; return Promise.resolve({ data: d?.[0] ?? null, error: null }); },
      then(res: (v: unknown) => unknown, rej?: (e: unknown) => unknown) { return Promise.resolve(run()).then(res, rej); },
    };
    return q;
  }
  return { client: { from }, tables, log };
}
