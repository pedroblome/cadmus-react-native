import { create } from 'zustand';
import { SchoolClass, CreateClassInput, UpdateClassInput } from '../types/class';
import { classesService } from '../services/classesService';
import { useSchoolsStore } from '@/src/features/schools/store/schoolsStore';

interface ClassesState {
  classes: SchoolClass[];
  isLoading: boolean;
  error: string | null;

  fetchClasses: (schoolId: string) => Promise<void>;
  addClass: (input: CreateClassInput) => Promise<SchoolClass>;
  updateClass: (id: string, input: UpdateClassInput) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

export const useClassesStore = create<ClassesState>((set, get) => ({
  classes: [],
  isLoading: false,
  error: null,

  fetchClasses: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const classes = await classesService.getBySchool(schoolId);
      set({ classes, isLoading: false });
    } catch (e) {
      set({ error: 'Erro ao carregar turmas.', isLoading: false });
    }
  },

  addClass: async (input) => {
    const newClass = await classesService.create(input);
    set((state) => ({ classes: [...state.classes, newClass] }));
    useSchoolsStore.getState().updateClassCount(input.schoolId, +1);
    return newClass;
  },

  updateClass: async (id, input) => {
    const updated = await classesService.update(id, input);
    set((state) => ({
      classes: state.classes.map((c) => (c.id === id ? updated : c)),
    }));
  },

  removeClass: async (id) => {
    const cls = get().classes.find((c) => c.id === id);
    await classesService.remove(id);
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    }));
    if (cls) {
      useSchoolsStore.getState().updateClassCount(cls.schoolId, -1);
    }
  },
}));
