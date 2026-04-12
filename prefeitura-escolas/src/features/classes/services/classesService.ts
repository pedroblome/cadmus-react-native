import { http } from '@/src/infra/http/client';
import { SchoolClass, CreateClassInput, UpdateClassInput } from '../types/class';

export const classesService = {
  getBySchool: (schoolId: string) =>
    http.get<SchoolClass[]>(`/classes?schoolId=${schoolId}`),

  getById: (id: string) => http.get<SchoolClass>(`/classes/${id}`),

  create: (input: CreateClassInput) => http.post<SchoolClass>('/classes', input),

  update: (id: string, input: UpdateClassInput) =>
    http.put<SchoolClass>(`/classes/${id}`, input),

  remove: (id: string) => http.delete<void>(`/classes/${id}`),
};
