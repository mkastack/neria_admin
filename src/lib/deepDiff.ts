/**
 * Walks every leaf of `next` and compares it against `prev`. Whenever
 * a primitive differs, the formatter is called with the dotted path
 * and the new value, and its return string is pushed into `diffs`.
 *
 * This is the engine behind the editor's "Detected Changes" panel
 * during publishing. We deliberately keep it tiny and dependency-free
 * so the bundle stays small and the diff is deterministic.
 *
 * Behavior:
 *  - Objects are recursed into. Arrays are recursed element-by-element
 *    (so a deleted array element shows up as `arr.2 removed`).
 *  - null / undefined / primitive mismatches are surfaced.
 *  - Reference-equal subtrees short-circuit to keep the walk cheap.
 */
export function walkLeafDiff<T>(
  next: unknown,
  prev: unknown,
  pathPrefix: string[],
  out: string[],
  format: (path: string, prev: unknown, next: unknown) => string,
): void {
  if (Object.is(next, prev)) return;

  if (Array.isArray(next) && Array.isArray(prev)) {
    const max = Math.max(next.length, prev.length);
    for (let i = 0; i < max; i++) {
      const childPath = [...pathPrefix, String(i)];
      walkLeafDiff(next[i], prev[i], childPath, out, format);
    }
    return;
  }

  const nextIsObj = isPlainObject(next);
  const prevIsObj = isPlainObject(prev);
  if (nextIsObj && prevIsObj) {
    const keys = new Set([
      ...Object.keys(next as object),
      ...Object.keys(prev as object),
    ]);
    for (const k of keys) {
      walkLeafDiff(
        (next as Record<string, unknown>)[k],
        (prev as Record<string, unknown>)[k],
        [...pathPrefix, k],
        out,
        format,
      );
    }
    return;
  }

  // Leaf mismatch (one is primitive, or types differ).
  out.push(format(pathPrefix.join('.'), prev, next));
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Compact one-line summary of an arbitrary value for display in the
 * publish modal. Strings are truncated to 50 chars; objects/arrays
 * fall through to a type label so the diff stays scannable.
 */
export function summarize(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    return trimmed.length > 50 ? `"${trimmed.slice(0, 47)}…"` : `"${trimmed}"`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.length} item${value.length === 1 ? '' : 's'}]`;
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return `{${keys.slice(0, 4).join(', ')}${keys.length > 4 ? ', …' : ''}}`;
  }
  return String(value);
}
