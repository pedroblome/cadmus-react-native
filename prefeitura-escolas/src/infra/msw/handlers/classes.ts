import { http, HttpResponse } from 'msw';
import { seedClasses } from '../seed';
import { SchoolClass, CreateClassInput, UpdateClassInput } from '@/src/features/classes/types/class';
import { updateSchoolClassCount } from './schools';

// Estado mutável em memória — simulação do banco de dados
let classes: SchoolClass[] = [...seedClasses];

const BASE = 'http://localhost:3000/api';

export const classHandlers = [
  // GET /classes?schoolId=:schoolId
  http.get(`${BASE}/classes`, ({ request }) => {
    const url = new URL(request.url);
    const schoolId = url.searchParams.get('schoolId');
    const result = schoolId ? classes.filter((c) => c.schoolId === schoolId) : classes;
    return HttpResponse.json(result);
  }),

  // GET /classes/:id
  http.get(`${BASE}/classes/:id`, ({ params }) => {
    const cls = classes.find((c) => c.id === params.id);
    if (!cls) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(cls);
  }),

  // POST /classes
  http.post(`${BASE}/classes`, async ({ request }) => {
    const body = (await request.json()) as CreateClassInput;
    const now = new Date().toISOString();
    const newClass: SchoolClass = {
      id: String(Date.now()),
      schoolId: body.schoolId,
      name: body.name,
      shift: body.shift,
      academicYear: body.academicYear,
      createdAt: now,
      updatedAt: now,
    };
    classes = [...classes, newClass];
    updateSchoolClassCount(body.schoolId, classes);
    return HttpResponse.json(newClass, { status: 201 });
  }),

  // PUT /classes/:id
  http.put(`${BASE}/classes/:id`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateClassInput;
    const index = classes.findIndex((c) => c.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated: SchoolClass = {
      ...classes[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    classes = classes.map((c) => (c.id === params.id ? updated : c));
    return HttpResponse.json(updated);
  }),

  // DELETE /classes/:id
  http.delete(`${BASE}/classes/:id`, ({ params }) => {
    const cls = classes.find((c) => c.id === params.id);
    if (!cls) return new HttpResponse(null, { status: 404 });
    classes = classes.filter((c) => c.id !== params.id);
    updateSchoolClassCount(cls.schoolId, classes);
    return new HttpResponse(null, { status: 204 });
  }),
];
