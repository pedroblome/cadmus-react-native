import { http, HttpResponse } from 'msw';
import { seedSchools } from '../seed';
import { School, CreateSchoolInput, UpdateSchoolInput } from '@/src/features/schools/types/school';

// Estado mutável em memória — simulação do banco de dados
let schools: School[] = [...seedSchools];

const BASE = 'http://localhost:3000/api';

function recalcClassCount(schoolId: string, classes: { schoolId: string }[]): number {
  return classes.filter((c) => c.schoolId === schoolId).length;
}

export function updateSchoolClassCount(schoolId: string, classes: { schoolId: string }[]) {
  schools = schools.map((s) =>
    s.id === schoolId ? { ...s, classCount: recalcClassCount(schoolId, classes) } : s
  );
}

export const schoolHandlers = [
  // GET /schools
  http.get(`${BASE}/schools`, () => {
    return HttpResponse.json(schools);
  }),

  // GET /schools/:id
  http.get(`${BASE}/schools/:id`, ({ params }) => {
    const school = schools.find((s) => s.id === params.id);
    if (!school) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(school);
  }),

  // POST /schools
  http.post(`${BASE}/schools`, async ({ request }) => {
    const body = (await request.json()) as CreateSchoolInput;
    const now = new Date().toISOString();
    const newSchool: School = {
      id: String(Date.now()),
      name: body.name,
      address: body.address,
      classCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    schools = [...schools, newSchool];
    return HttpResponse.json(newSchool, { status: 201 });
  }),

  // PUT /schools/:id
  http.put(`${BASE}/schools/:id`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateSchoolInput;
    const index = schools.findIndex((s) => s.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated: School = {
      ...schools[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    schools = schools.map((s) => (s.id === params.id ? updated : s));
    return HttpResponse.json(updated);
  }),

  // DELETE /schools/:id
  http.delete(`${BASE}/schools/:id`, ({ params }) => {
    const exists = schools.some((s) => s.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    schools = schools.filter((s) => s.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
