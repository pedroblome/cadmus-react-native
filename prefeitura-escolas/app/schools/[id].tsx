import { View, Text, ActivityIndicator } from 'react-native';

// Placeholder — implementação completa na ETAPA 7 (módulo de turmas)
export default function SchoolDetailScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-0">
      <ActivityIndicator size="large" />
      <Text className="text-typography-400 mt-3 text-sm">Carregando turmas...</Text>
    </View>
  );
}
