import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSchoolsStore } from '@/src/features/schools/store/schoolsStore';
import { useClasses } from '@/src/features/classes/hooks/useClasses';
import { ClassCard } from '@/src/features/classes/components/ClassCard';
import { ClassFormModal } from '@/src/features/classes/components/ClassFormModal';
import { ClassListEmpty } from '@/src/features/classes/components/ClassListEmpty';
import { SchoolClass, Shift, CreateClassInput } from '@/src/features/classes/types/class';

const SHIFTS: Array<Shift | null> = [null, Shift.MORNING, Shift.AFTERNOON, Shift.NIGHT];
const SHIFT_LABEL: Record<string, string> = {
  null: 'Todos',
  [Shift.MORNING]: 'Manhã',
  [Shift.AFTERNOON]: 'Tarde',
  [Shift.NIGHT]: 'Noite',
};

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const school = useSchoolsStore((s) => s.schools.find((sc) => sc.id === id));

  const [shiftFilter, setShiftFilter] = useState<Shift | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const { classes, totalCount, isLoading, isSubmitting, error, availableYears, create, update, remove } =
    useClasses({ schoolId: id, shiftFilter, yearFilter });

  const hasFilter = shiftFilter !== null || yearFilter !== null;

  const clearFilters = () => {
    setShiftFilter(null);
    setYearFilter(null);
  };

  const openCreate = () => {
    setEditingClass(null);
    setModalOpen(true);
  };

  const openEdit = (cls: SchoolClass) => {
    setEditingClass(cls);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Omit<CreateClassInput, 'schoolId'>) => {
    if (editingClass) {
      await update(editingClass.id, data);
    } else {
      await create({ ...data, schoolId: id });
    }
    setModalOpen(false);
  };

  if (!school) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <Text className="text-typography-400">Escola não encontrada.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-600 font-medium">← Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: school.name }} />

      <View className="flex-1 bg-background-0">
        {/* Info da escola */}
        <View className="px-4 pt-4 pb-3 border-b border-outline-100">
          <Text className="text-typography-500 text-sm" numberOfLines={1}>
            📍 {school.address}
          </Text>
        </View>

        {/* Painel de filtros */}
        <View className="px-4 pt-3 pb-2 border-b border-outline-50">
          {/* Filtro por turno */}
          <Text className="text-typography-500 text-xs font-medium mb-2 uppercase tracking-wider">
            Turno
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2 pr-2">
              {SHIFTS.map((s) => {
                const key = String(s);
                const isActive = shiftFilter === s;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setShiftFilter(s)}
                    className={`px-3 h-8 rounded-full items-center justify-center border ${
                      isActive
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-background-0 border-outline-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isActive ? 'text-typography-0' : 'text-typography-600'
                      }`}
                    >
                      {SHIFT_LABEL[key]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Filtro por ano letivo */}
          {availableYears.length > 0 && (
            <>
              <Text className="text-typography-500 text-xs font-medium mb-2 uppercase tracking-wider">
                Ano letivo
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
                <View className="flex-row gap-2 pr-2">
                  {/* Opção "Todos" */}
                  <Pressable
                    onPress={() => setYearFilter(null)}
                    className={`px-3 h-8 rounded-full items-center justify-center border ${
                      yearFilter === null
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-background-0 border-outline-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        yearFilter === null ? 'text-typography-0' : 'text-typography-600'
                      }`}
                    >
                      Todos
                    </Text>
                  </Pressable>
                  {availableYears.map((year) => {
                    const isActive = yearFilter === year;
                    return (
                      <Pressable
                        key={year}
                        onPress={() => setYearFilter(year)}
                        className={`px-3 h-8 rounded-full items-center justify-center border ${
                          isActive
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-background-0 border-outline-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            isActive ? 'text-typography-0' : 'text-typography-600'
                          }`}
                        >
                          {year}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </>
          )}
        </View>

        {/* Contador + limpar filtros */}
        <View className="px-4 py-2 flex-row items-center justify-between">
          <Text className="text-typography-400 text-xs">
            {classes.length === 1 ? '1 turma' : `${classes.length} turmas`}
            {hasFilter ? ` de ${totalCount}` : ' cadastrada(s)'}
          </Text>
          {hasFilter && (
            <Pressable onPress={clearFilters} hitSlop={8}>
              <Text className="text-primary-600 text-xs font-medium">✕ Limpar filtros</Text>
            </Pressable>
          )}
        </View>

        {/* Lista */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="text-typography-400 mt-3 text-sm">Carregando turmas...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-error-500 text-base text-center">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 100,
              flexGrow: 1,
            }}
            ListEmptyComponent={<ClassListEmpty hasFilter={hasFilter} />}
            renderItem={({ item }) => (
              <ClassCard
                schoolClass={item}
                onEdit={() => openEdit(item)}
                onDelete={() => remove(item.id)}
              />
            )}
          />
        )}

        {/* FAB */}
        <Pressable
          onPress={openCreate}
          className="absolute bottom-6 right-6 bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-hard-3 active:opacity-80"
        >
          <Text className="text-typography-0 text-2xl leading-none">+</Text>
        </Pressable>

        {/* Modal */}
        <ClassFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingClass}
          isSubmitting={isSubmitting}
        />
      </View>
    </>
  );
}
