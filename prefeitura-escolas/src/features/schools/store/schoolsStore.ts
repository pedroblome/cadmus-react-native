import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { School, CreateSchoolInput, UpdateSchoolInput } from '../types/school';
import { schoolsService } from '../services/schoolsService';

interface SchoolsState {
  schools: School[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;

  fetchSchools: () => Promise<void>;
  addSchool: (input: CreateSchoolInput) => Promise<School>;
  updateSchool: (id: string, input: UpdateSchoolInput) => Promise<void>;
  removeSchool: (id: string) => Promise<void>;
  updateClassCount: (schoolId: string, delta: number) => void;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      schools: [],
      isLoading: false,
      error: null,
      isOffline: false,

      fetchSchools: async () => {
        set({ isLoading: true, error: null, isOffline: false });
        try {
          const schools = await schoolsService.getAll();
          set({ schools, isLoading: false });
        } catch {
          const hasCached = get().schools.length > 0;
          set({
            error: hasCached ? null : 'Sem conexão e sem dados em cache.',
            isOffline: hasCached,
            isLoading: false,
          });
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
    }),
    {
      name: 'schools-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ schools: state.schools }),
    }
  )
);
