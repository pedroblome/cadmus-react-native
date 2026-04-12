import React from 'react';
import { View, Text } from 'react-native';

interface ClassListEmptyProps {
  hasFilter: boolean;
}

export function ClassListEmpty({ hasFilter }: ClassListEmptyProps) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text className="text-4xl mb-4">📚</Text>
      {hasFilter ? (
        <>
          <Text className="text-typography-700 text-base font-medium mb-1">
            Nenhuma turma encontrada
          </Text>
          <Text className="text-typography-400 text-sm text-center px-8">
            Tente remover os filtros aplicados.
          </Text>
        </>
      ) : (
        <>
          <Text className="text-typography-700 text-base font-medium mb-1">
            Nenhuma turma cadastrada
          </Text>
          <Text className="text-typography-400 text-sm text-center px-8">
            Toque no botão "+" para adicionar a primeira turma.
          </Text>
        </>
      )}
    </View>
  );
}
