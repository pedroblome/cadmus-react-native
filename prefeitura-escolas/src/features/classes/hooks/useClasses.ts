import { useEffect, useState } from 'react';
import { useClassesStore } from '../store/classesStore';
import { CreateClassInput, UpdateClassInput, Shift } from '../types/class';

interface UseClassesOptions {
  schoolId: string;
  shiftFilter?: Shift | null;
  yearFilter?: number | null;
}

export function useClasses({ schoolId, shiftFilter = null, yearFilter = null }: UseClassesOptions) {
  const { classes, isLoading, error, fetchClasses, addClass, updateClass, removeClass } =
    useClassesStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (schoolId) fetchClasses(schoolId);
  }, [schoolId]);

  const filtered = classes.filter((c) => {
    if (shiftFilter && c.shift !== shiftFilter) return false;
    if (yearFilter && c.academicYear !== yearFilter) return false;
    return true;
  });

  const create = async (input: CreateClassInput) => {
    setIsSubmitting(true);
    try {
      const cls = await addClass(input);
      return cls;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id: string, input: UpdateClassInput) => {
    setIsSubmitting(true);
    try {
      await updateClass(id, input);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    await removeClass(id);
  };

  const availableYears = [...new Set(classes.map((c) => c.academicYear))].sort((a, b) => b - a);

  return {
    classes: filtered,
    totalCount: classes.length,
    isLoading,
    isSubmitting,
    error,
    availableYears,
    create,
    update,
    remove,
  };
}
