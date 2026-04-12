import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const INFO_ITEMS = [
  { label: 'Versão', value: '1.0.0' },
  { label: 'Expo SDK', value: '54' },
  { label: 'React Native', value: '0.81' },
  { label: 'React', value: '19' },
  { label: 'Roteamento', value: 'Expo Router 6' },
  { label: 'UI', value: 'Gluestack UI v3' },
  { label: 'Estilização', value: 'NativeWind (Tailwind CSS)' },
  { label: 'Estado', value: 'Zustand' },
  { label: 'Mock API', value: 'MSW v2 (native)' },
  { label: 'Persistência', value: 'AsyncStorage' },
  { label: 'Linguagem', value: 'TypeScript 5.9' },
];

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-background-0">
      <View className="px-4 pt-6 pb-10">
        {/* Cabeçalho */}
        <View className="items-center mb-8">
          <Text className="text-5xl mb-3">🏫</Text>
          <Text className="text-typography-900 text-2xl font-bold text-center">
            Prefeitura Escolas
          </Text>
          <Text className="text-typography-500 text-sm text-center mt-1">
            Gestão de escolas e turmas públicas
          </Text>
        </View>

        {/* Descrição */}
        <View className="bg-background-50 border border-outline-100 rounded-xl p-4 mb-6">
          <Text className="text-typography-700 text-sm leading-5">
            Aplicativo desenvolvido como desafio técnico para centralizar o cadastro das escolas
            públicas municipais e de suas respectivas turmas, substituindo o controle manual
            em planilhas Excel.
          </Text>
        </View>

        {/* Stack técnica */}
        <Text className="text-typography-900 text-base font-semibold mb-3">
          Stack técnica
        </Text>
        <View className="bg-background-50 border border-outline-100 rounded-xl overflow-hidden">
          {INFO_ITEMS.map((item, index) => (
            <View
              key={item.label}
              className={`flex-row justify-between px-4 py-3 ${
                index < INFO_ITEMS.length - 1 ? 'border-b border-outline-100' : ''
              }`}
            >
              <Text className="text-typography-500 text-sm">{item.label}</Text>
              <Text className="text-typography-800 text-sm font-medium">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
