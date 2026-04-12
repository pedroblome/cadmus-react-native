import { useEffect, useState } from 'react';
import { useSchoolsStore } from '../store/schoolsStore';
import { CreateSchoolInput, UpdateSchoolInput } from '../types/school';

export function useSchools(searchQuery = '') {
  const { schools, isLoading, error, fetchSchools, addSchool, updateSchool, removeSchool } =
    useSchoolsStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const filtered = searchQuery.trim()
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : schools;

  const create = async (input: CreateSchoolInput) => {
    setIsSubmitting(true);
    try {
      const school = await addSchool(input);
      return school;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id: string, input: UpdateSchoolInput) => {
    setIsSubmitting(true);
    try {
      await updateSchool(id, input);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    await removeSchool(id);
  };

  return {
    schools: filtered,
    totalCount: schools.length,
    isLoading,
    isSubmitting,
    error,
    create,
    update,
    remove,
  };
}
