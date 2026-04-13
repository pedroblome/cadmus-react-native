/**
 * Mock Server — intercepta global.fetch em desenvolvimento.
 * Substitui o MSW (incompatível com Hermes) por um roteador fetch simples.
 * Não depende de nenhuma API de browser — funciona em qualquer JS engine.
 */

import { seedSchools, seedClasses } from '../msw/seed';
import { School, CreateSchoolInput, UpdateSchoolInput } from '@/src/features/schools/types/school';
import { SchoolClass, CreateClassInput, UpdateClassInput } from '@/src/features/classes/types/class';

// ─── Estado em memória ───────────────────────────────────────────────────────
let schools: School[] = [...seedSchools];
let classes: SchoolClass[] = [...seedClasses];

function syncClassCount(schoolId: string) {
  schools = schools.map((s) =>
    s.id === schoolId ? { ...s, classCount: classes.filter((c) => c.schoolId === schoolId).length } : s
  );
}

// ─── Helpers de resposta ─────────────────────────────────────────────────────
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
function notFound() { return json({ error: 'Not found' }, 404); }
function noContent() { return new Response(null, { status: 204 }); }

// ─── Roteador ────────────────────────────────────────────────────────────────
async function router(url: URL, method: string, body: unknown): Promise<Response | null> {
  const p = url.pathname;

  // ── /api/schools ──
  if (p === '/api/schools' && method === 'GET') {
    return json(schools);
  }
  if (p === '/api/schools' && method === 'POST') {
    const input = body as CreateSchoolInput;
    const now = new Date().toISOString();
    const school: School = { id: String(Date.now()), ...input, classCount: 0, createdAt: now, updatedAt: now };
    schools = [...schools, school];
    return json(school, 201);
  }

  const schoolMatch = p.match(/^\/api\/schools\/([^/]+)$/);
  if (schoolMatch) {
    const id = schoolMatch[1];
    if (method === 'GET') {
      const s = schools.find((s) => s.id === id);
      return s ? json(s) : notFound();
    }
    if (method === 'PUT') {
      const input = body as UpdateSchoolInput;
      const idx = schools.findIndex((s) => s.id === id);
      if (idx === -1) return notFound();
      const updated = { ...schools[idx], ...input, updatedAt: new Date().toISOString() };
      schools = schools.map((s) => (s.id === id ? updated : s));
      return json(updated);
    }
    if (method === 'DELETE') {
      if (!schools.some((s) => s.id === id)) return notFound();
      schools = schools.filter((s) => s.id !== id);
      classes = classes.filter((c) => c.schoolId !== id);
      return noContent();
    }
  }

  // ── /api/classes ──
  if (p === '/api/classes' && method === 'GET') {
    const schoolId = url.searchParams.get('schoolId');
    return json(schoolId ? classes.filter((c) => c.schoolId === schoolId) : classes);
  }
  if (p === '/api/classes' && method === 'POST') {
    const input = body as CreateClassInput;
    const now = new Date().toISOString();
    const cls: SchoolClass = { id: String(Date.now()), ...input, createdAt: now, updatedAt: now };
    classes = [...classes, cls];
    syncClassCount(input.schoolId);
    return json(cls, 201);
  }

  const classMatch = p.match(/^\/api\/classes\/([^/]+)$/);
  if (classMatch) {
    const id = classMatch[1];
    if (method === 'GET') {
      const c = classes.find((c) => c.id === id);
      return c ? json(c) : notFound();
    }
    if (method === 'PUT') {
      const input = body as UpdateClassInput;
      const idx = classes.findIndex((c) => c.id === id);
      if (idx === -1) return notFound();
      const updated = { ...classes[idx], ...input, updatedAt: new Date().toISOString() };
      classes = classes.map((c) => (c.id === id ? updated : c));
      return json(updated);
    }
    if (method === 'DELETE') {
      const cls = classes.find((c) => c.id === id);
      if (!cls) return notFound();
      classes = classes.filter((c) => c.id !== id);
      syncClassCount(cls.schoolId);
      return noContent();
    }
  }

  return null; // rota não encontrada — passa para o fetch real
}

// ─── Interceptor ─────────────────────────────────────────────────────────────
export function setupMockServer() {
  const originalFetch = global.fetch;

  global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;

    let url: URL;
    try {
      url = new URL(urlStr);
    } catch {
      return originalFetch(input, init);
    }

    if (!urlStr.includes('localhost:3000')) {
      return originalFetch(input, init);
    }

    const method = (init?.method ?? 'GET').toUpperCase();
    let body: unknown = null;
    if (init?.body) {
      try { body = JSON.parse(init.body as string); } catch { body = init.body; }
    }

    if (__DEV__) {
      console.log(`[Mock] ${method} ${url.pathname}`);
    }

    const response = await router(url, method, body);
    return response ?? originalFetch(input, init);
  };
}
