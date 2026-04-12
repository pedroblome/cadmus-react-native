import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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
import { School } from '../types/school';

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; address: string }) => Promise<void>;
  initialData?: School | null;
  isSubmitting: boolean;
}

export function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: SchoolFormModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setAddress(initialData?.address ?? '');
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ name: name.trim(), address: address.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-bold">
            {isEditing ? 'Editar escola' : 'Nova escola'}
          </Text>
          <ModalCloseButton>
            <Text className="text-typography-400 text-xl px-1">✕</Text>
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Campo: Nome */}
          <View className="mb-4">
            <Text className="text-typography-700 text-sm font-medium mb-1">
              Nome da escola <Text className="text-error-500">*</Text>
            </Text>
            <Input variant="outline" size="md" isInvalid={!!errors.name}>
              <InputField
                placeholder="Ex: E.M. João da Silva"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </Input>
            {errors.name && (
              <Text className="text-error-500 text-xs mt-1">{errors.name}</Text>
            )}
          </View>

          {/* Campo: Endereço */}
          <View className="mb-2">
            <Text className="text-typography-700 text-sm font-medium mb-1">
              Endereço <Text className="text-error-500">*</Text>
            </Text>
            <Input variant="outline" size="md" isInvalid={!!errors.address}>
              <InputField
                placeholder="Ex: Rua das Flores, 123 - Centro"
                value={address}
                onChangeText={setAddress}
                autoCapitalize="sentences"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </Input>
            {errors.address && (
              <Text className="text-error-500 text-xs mt-1">{errors.address}</Text>
            )}
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
