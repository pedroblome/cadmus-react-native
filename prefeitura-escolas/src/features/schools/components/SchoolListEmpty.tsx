import React from 'react';
import { View, Text } from 'react-native';

interface SchoolListEmptyProps {
  hasSearch: boolean;
}

export function SchoolListEmpty({ hasSearch }: SchoolListEmptyProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-4xl mb-4">🏫</Text>
      {hasSearch ? (
        <>
          <Text className="text-typography-700 text-base font-medium mb-1">
            Nenhuma escola encontrada
          </Text>
          <Text className="text-typography-400 text-sm text-center px-8">
            Tente buscar por outro nome ou endereço.
          </Text>
        </>
      ) : (
        <>
          <Text className="text-typography-700 text-base font-medium mb-1">
            Nenhuma escola cadastrada
          </Text>
          <Text className="text-typography-400 text-sm text-center px-8">
            Toque no botão "+" para adicionar a primeira escola.
          </Text>
        </>
      )}
    </View>
  );
}
