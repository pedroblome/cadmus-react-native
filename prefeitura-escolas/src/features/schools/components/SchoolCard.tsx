import React from 'react';
import { Pressable, View, Text, Alert } from 'react-native';
import { School } from '../types/school';

interface SchoolCardProps {
  school: School;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SchoolCard({ school, onPress, onEdit, onDelete }: SchoolCardProps) {
  const handleDelete = () => {
    Alert.alert(
      'Excluir escola',
      `Deseja excluir "${school.name}"? As turmas vinculadas também serão removidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-50 border border-outline-100 rounded-xl p-4 mb-3 active:opacity-70"
    >
      {/* Header: nome + actions */}
      <View className="flex-row items-start justify-between mb-2">
        <Text
          className="text-typography-900 text-base font-semibold flex-1 mr-3"
          numberOfLines={2}
        >
          {school.name}
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            className="bg-primary-100 rounded-lg px-3 py-1 active:opacity-70"
          >
            <Text className="text-primary-700 text-xs font-medium">Editar</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            hitSlop={8}
            className="bg-error-100 rounded-lg px-3 py-1 active:opacity-70"
          >
            <Text className="text-error-700 text-xs font-medium">Excluir</Text>
          </Pressable>
        </View>
      </View>

      {/* Endereço */}
      <Text className="text-typography-500 text-sm mb-3" numberOfLines={1}>
        📍 {school.address}
      </Text>

      {/* Rodapé: contador de turmas */}
      <View className="flex-row items-center justify-between border-t border-outline-100 pt-2">
        <Text className="text-typography-400 text-xs">
          {school.classCount === 1
            ? '1 turma'
            : `${school.classCount} turmas`}
        </Text>
        <Text className="text-primary-600 text-xs font-medium">Ver turmas →</Text>
      </View>
    </Pressable>
  );
}
