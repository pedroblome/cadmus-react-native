import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchoolClass, CreateClassInput, UpdateClassInput } from '../types/class';
import { classesService } from '../services/classesService';
import { useSchoolsStore } from '@/src/features/schools/store/schoolsStore';

interface ClassesState {
  classes: SchoolClass[];
  cachedSchoolId: string | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;

  fetchClasses: (schoolId: string) => Promise<void>;
  addClass: (input: CreateClassInput) => Promise<SchoolClass>;
  updateClass: (id: string, input: UpdateClassInput) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

export const useClassesStore = create<ClassesState>()(
  persist(
    (set, get) => ({
      classes: [],
      cachedSchoolId: null,
      isLoading: false,
      error: null,
      isOffline: false,

      fetchClasses: async (schoolId) => {
        const isDifferentSchool = get().cachedSchoolId !== schoolId;
        set({
          isLoading: true,
          error: null,
          isOffline: false,
          classes: isDifferentSchool ? [] : get().classes,
          cachedSchoolId: schoolId,
        });
        try {
          const classes = await classesService.getBySchool(schoolId);
          set({ classes, isLoading: false });
        } catch {
          const hasCached = !isDifferentSchool && get().classes.length > 0;
          set({
            error: hasCached ? null : 'Sem conexão e sem dados em cache.',
            isOffline: hasCached,
            isLoading: false,
          });
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
    }),
    {
      name: 'classes-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        classes: state.classes,
        cachedSchoolId: state.cachedSchoolId,
      }),
    }
  )
);
