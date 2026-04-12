import { http } from '@/src/infra/http/client';
import { School, CreateSchoolInput, UpdateSchoolInput } from '../types/school';

export const schoolsService = {
  getAll: () => http.get<School[]>('/schools'),

  getById: (id: string) => http.get<School>(`/schools/${id}`),

  create: (input: CreateSchoolInput) => http.post<School>('/schools', input),

  update: (id: string, input: UpdateSchoolInput) =>
    http.put<School>(`/schools/${id}`, input),

  remove: (id: string) => http.delete<void>(`/schools/${id}`),
};
