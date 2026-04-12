import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { SchoolClass, Shift, CreateClassInput } from '../types/class';

const SHIFTS = [Shift.MORNING, Shift.AFTERNOON, Shift.NIGHT];
const SHIFT_LABEL: Record<Shift, string> = {
  [Shift.MORNING]: 'Manhã',
  [Shift.AFTERNOON]: 'Tarde',
  [Shift.NIGHT]: 'Noite',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateClassInput, 'schoolId'>) => Promise<void>;
  initialData?: SchoolClass | null;
  isSubmitting: boolean;
}

export function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ClassFormModalProps) {
  const [name, setName] = useState('');
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [academicYear, setAcademicYear] = useState(CURRENT_YEAR);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setShift(initialData?.shift ?? Shift.MORNING);
      setAcademicYear(initialData?.academicYear ?? CURRENT_YEAR);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome da turma é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ name: name.trim(), shift, academicYear });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-bold">
            {isEditing ? 'Editar turma' : 'Nova turma'}
          </Text>
          <ModalCloseButton>
            <Text className="text-typography-400 text-xl px-1">✕</Text>
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Nome */}
          <View className="mb-4">
            <Text className="text-typography-700 text-sm font-medium mb-1">
              Nome da turma <Text className="text-error-500">*</Text>
            </Text>
            <Input variant="outline" size="md" isInvalid={!!errors.name}>
              <InputField
                placeholder="Ex: 5º Ano A"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </Input>
            {errors.name && (
              <Text className="text-error-500 text-xs mt-1">{errors.name}</Text>
            )}
          </View>

          {/* Turno */}
          <View className="mb-4">
            <Text className="text-typography-700 text-sm font-medium mb-2">Turno</Text>
            <View className="flex-row gap-2">
              {SHIFTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setShift(s)}
                  className={`flex-1 h-10 rounded-lg items-center justify-center border ${
                    shift === s
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-background-0 border-outline-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      shift === s ? 'text-typography-0' : 'text-typography-600'
                    }`}
                  >
                    {SHIFT_LABEL[s]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Ano letivo */}
          <View className="mb-2">
            <Text className="text-typography-700 text-sm font-medium mb-2">Ano letivo</Text>
            <View className="flex-row gap-2">
              {YEARS.map((y) => (
                <Pressable
                  key={y}
                  onPress={() => setAcademicYear(y)}
                  className={`flex-1 h-10 rounded-lg items-center justify-center border ${
                    academicYear === y
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-background-0 border-outline-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      academicYear === y ? 'text-typography-0' : 'text-typography-600'
                    }`}
                  >
                    {y}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" action="secondary" onPress={onClose} size="sm">
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={handleSubmit} size="sm" isDisabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ButtonText>{isEditing ? 'Salvar' : 'Adicionar'}</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
