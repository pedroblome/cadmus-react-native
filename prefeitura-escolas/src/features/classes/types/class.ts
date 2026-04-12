export enum Shift {
  MORNING = 'MANHÃ',
  AFTERNOON = 'TARDE',
  NIGHT = 'NOITE',
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  academicYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassInput {
  schoolId: string;
  name: string;
  shift: Shift;
  academicYear: number;
}

export interface UpdateClassInput {
  name?: string;
  shift?: Shift;
  academicYear?: number;
}
