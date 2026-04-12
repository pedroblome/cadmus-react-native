import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSchools } from '@/src/features/schools/hooks/useSchools';
import { SchoolCard } from '@/src/features/schools/components/SchoolCard';
import { SchoolFormModal } from '@/src/features/schools/components/SchoolFormModal';
import { SchoolListEmpty } from '@/src/features/schools/components/SchoolListEmpty';
import { School } from '@/src/features/schools/types/school';

export default function SchoolsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const { schools, isLoading, isSubmitting, error, create, update, remove } =
    useSchools(search);

  const openCreate = () => {
    setEditingSchool(null);
    setModalOpen(true);
  };

  const openEdit = (school: School) => {
    setEditingSchool(school);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; address: string }) => {
    if (editingSchool) {
      await update(editingSchool.id, data);
    } else {
      await create(data);
    }
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" />
        <Text className="text-typography-400 mt-3 text-sm">Carregando escolas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 px-6">
        <Text className="text-error-500 text-base text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-0">
      {/* Barra de busca */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-background-50 border border-outline-100 rounded-xl px-3 h-10">
          <Text className="text-typography-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-typography-900 text-sm"
            placeholder="Buscar por nome ou endereço..."
            placeholderTextColor="#a0a0a0"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <Text className="text-typography-400 text-base px-1">✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Contador */}
      <View className="px-4 pb-2">
        <Text className="text-typography-400 text-xs">
          {schools.length === 1 ? '1 escola' : `${schools.length} escolas`}
          {search ? ' encontrada(s)' : ' cadastrada(s)'}
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={schools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
        ListEmptyComponent={<SchoolListEmpty hasSearch={search.length > 0} />}
        renderItem={({ item }) => (
          <SchoolCard
            school={item}
            onPress={() => router.push(`/schools/${item.id}`)}
            onEdit={() => openEdit(item)}
            onDelete={() => remove(item.id)}
          />
        )}
      />

      {/* FAB — botão flutuante para adicionar */}
      <Pressable
        onPress={openCreate}
        className="absolute bottom-6 right-6 bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-hard-3 active:opacity-80"
      >
        <Text className="text-typography-0 text-2xl leading-none">+</Text>
      </Pressable>

      {/* Modal de cadastro/edição */}
      <SchoolFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingSchool}
        isSubmitting={isSubmitting}
      />
    </View>
  );
}
