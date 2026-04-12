import { create } from 'zustand';
import { School, CreateSchoolInput, UpdateSchoolInput } from '../types/school';
import { schoolsService } from '../services/schoolsService';

interface SchoolsState {
  schools: School[];
  isLoading: boolean;
  error: string | null;

  fetchSchools: () => Promise<void>;
  addSchool: (input: CreateSchoolInput) => Promise<School>;
  updateSchool: (id: string, input: UpdateSchoolInput) => Promise<void>;
  removeSchool: (id: string) => Promise<void>;
  updateClassCount: (schoolId: string, delta: number) => void;
}

export const useSchoolsStore = create<SchoolsState>((set, get) => ({
  schools: [],
  isLoading: false,
  error: null,

  fetchSchools: async () => {
    set({ isLoading: true, error: null });
    try {
      const schools = await schoolsService.getAll();
      set({ schools, isLoading: false });
    } catch (e) {
      set({ error: 'Erro ao carregar escolas.', isLoading: false });
    }
  },

  addSchool: async (input) => {
    const school = await schoolsService.create(input);
    set((state) => ({ schools: [...state.schools, school] }));
    return school;
  },

  updateSchool: async (id, input) => {
    const updated = await schoolsService.update(id, input);
    set((state) => ({
      schools: state.schools.map((s) => (s.id === id ? updated : s)),
    }));
  },

  removeSchool: async (id) => {
    await schoolsService.remove(id);
    set((state) => ({
      schools: state.schools.filter((s) => s.id !== id),
    }));
  },

  updateClassCount: (schoolId, delta) => {
    set((state) => ({
      schools: state.schools.map((s) =>
        s.id === schoolId
          ? { ...s, classCount: Math.max(0, s.classCount + delta) }
          : s
      ),
    }));
  },
}));
