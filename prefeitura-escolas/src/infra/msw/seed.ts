import { School } from '@/src/features/schools/types/school';
import { SchoolClass, Shift } from '@/src/features/classes/types/class';

export const seedSchools: School[] = [
  {
    id: '1',
    name: 'E.M. Professor João Silva',
    address: 'Rua das Flores, 123 - Centro',
    classCount: 3,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: '2',
    name: 'E.M. Maria das Graças',
    address: 'Av. Brasil, 456 - Jardim América',
    classCount: 2,
    createdAt: '2024-01-12T09:00:00.000Z',
    updatedAt: '2024-01-12T09:00:00.000Z',
  },
  {
    id: '3',
    name: 'E.M. Dom Pedro II',
    address: 'Rua Independência, 789 - Vila Nova',
    classCount: 2,
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-02-01T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'E.M. Santos Dumont',
    address: 'Rua dos Aviadores, 10 - Aeroporto',
    classCount: 1,
    createdAt: '2024-03-05T11:00:00.000Z',
    updatedAt: '2024-03-05T11:00:00.000Z',
  },
];

export const seedClasses: SchoolClass[] = [
  // Escola 1
  {
    id: '101',
    schoolId: '1',
    name: '5º Ano A',
    shift: Shift.MORNING,
    academicYear: 2025,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: '102',
    schoolId: '1',
    name: '6º Ano B',
    shift: Shift.AFTERNOON,
    academicYear: 2025,
    createdAt: '2024-01-10T08:10:00.000Z',
    updatedAt: '2024-01-10T08:10:00.000Z',
  },
  {
    id: '103',
    schoolId: '1',
    name: 'EJA - Turma 1',
    shift: Shift.NIGHT,
    academicYear: 2025,
    createdAt: '2024-01-10T08:20:00.000Z',
    updatedAt: '2024-01-10T08:20:00.000Z',
  },
  // Escola 2
  {
    id: '201',
    schoolId: '2',
    name: '3º Ano A',
    shift: Shift.MORNING,
    academicYear: 2025,
    createdAt: '2024-01-12T09:00:00.000Z',
    updatedAt: '2024-01-12T09:00:00.000Z',
  },
  {
    id: '202',
    schoolId: '2',
    name: '4º Ano B',
    shift: Shift.AFTERNOON,
    academicYear: 2025,
    createdAt: '2024-01-12T09:10:00.000Z',
    updatedAt: '2024-01-12T09:10:00.000Z',
  },
  // Escola 3
  {
    id: '301',
    schoolId: '3',
    name: '1º Ano A',
    shift: Shift.MORNING,
    academicYear: 2025,
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-02-01T10:00:00.000Z',
  },
  {
    id: '302',
    schoolId: '3',
    name: '2º Ano A',
    shift: Shift.MORNING,
    academicYear: 2025,
    createdAt: '2024-02-01T10:10:00.000Z',
    updatedAt: '2024-02-01T10:10:00.000Z',
  },
  // Escola 4
  {
    id: '401',
    schoolId: '4',
    name: '7º Ano C',
    shift: Shift.AFTERNOON,
    academicYear: 2025,
    createdAt: '2024-03-05T11:00:00.000Z',
    updatedAt: '2024-03-05T11:00:00.000Z',
  },
];
