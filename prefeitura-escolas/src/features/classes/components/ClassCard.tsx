import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SchoolClass, Shift } from '../types/class';

const SHIFT_LABEL: Record<Shift, string> = {
  [Shift.MORNING]: '☀️ Manhã',
  [Shift.AFTERNOON]: '🌤️ Tarde',
  [Shift.NIGHT]: '🌙 Noite',
};

const SHIFT_COLOR: Record<Shift, string> = {
  [Shift.MORNING]: 'bg-warning-100 text-warning-700',
  [Shift.AFTERNOON]: 'bg-info-100 text-info-700',
  [Shift.NIGHT]: 'bg-secondary-100 text-secondary-700',
};

interface ClassCardProps {
  schoolClass: SchoolClass;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClassCard({ schoolClass, onEdit, onDelete }: ClassCardProps) {
  const shiftStyle = SHIFT_COLOR[schoolClass.shift];
  const [bg, fg] = shiftStyle.split(' ');

  const handleDelete = () => {
    Alert.alert(
      'Excluir turma',
      `Deseja excluir a turma "${schoolClass.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View className="bg-background-50 border border-outline-100 rounded-xl p-4 mb-3">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-typography-900 text-base font-semibold flex-1 mr-3">
          {schoolClass.name}
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

      {/* Badges: turno + ano */}
      <View className="flex-row gap-2">
        <View className={`${bg} rounded-full px-3 py-1`}>
          <Text className={`${fg} text-xs font-medium`}>
            {SHIFT_LABEL[schoolClass.shift]}
          </Text>
        </View>
        <View className="bg-background-100 rounded-full px-3 py-1">
          <Text className="text-typography-600 text-xs font-medium">
            📅 {schoolClass.academicYear}
          </Text>
        </View>
      </View>
    </View>
  );
}
