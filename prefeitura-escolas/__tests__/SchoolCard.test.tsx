import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SchoolCard } from '@/src/features/schools/components/SchoolCard';
import { School } from '@/src/features/schools/types/school';

const mockSchool: School = {
  id: '1',
  name: 'E.M. Professor João Silva',
  address: 'Rua das Flores, 123 - Centro',
  classCount: 3,
  createdAt: '2024-01-10T08:00:00.000Z',
  updatedAt: '2024-01-10T08:00:00.000Z',
};

describe('SchoolCard', () => {
  it('renderiza nome e endereço da escola', () => {
    const { getByText } = render(
      <SchoolCard
        school={mockSchool}
        onPress={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(getByText('E.M. Professor João Silva')).toBeTruthy();
    expect(getByText(/Rua das Flores/)).toBeTruthy();
  });

  it('exibe contador de turmas no singular', () => {
    const school = { ...mockSchool, classCount: 1 };
    const { getByText } = render(
      <SchoolCard school={school} onPress={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('1 turma')).toBeTruthy();
  });

  it('exibe contador de turmas no plural', () => {
    const { getByText } = render(
      <SchoolCard school={mockSchool} onPress={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('3 turmas')).toBeTruthy();
  });

  it('chama onPress ao tocar no card', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <SchoolCard school={mockSchool} onPress={onPress} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    fireEvent.press(getByText('E.M. Professor João Silva'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('chama onEdit ao tocar no botão Editar', () => {
    const onEdit = jest.fn();
    const { getByText } = render(
      <SchoolCard school={mockSchool} onPress={jest.fn()} onEdit={onEdit} onDelete={jest.fn()} />
    );
    fireEvent.press(getByText('Editar'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('abre Alert de confirmação ao tocar em Excluir', () => {
    const { Alert } = require('react-native');
    jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <SchoolCard school={mockSchool} onPress={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    fireEvent.press(getByText('Excluir'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Excluir escola',
      expect.stringContaining(mockSchool.name),
      expect.any(Array)
    );
  });
});
