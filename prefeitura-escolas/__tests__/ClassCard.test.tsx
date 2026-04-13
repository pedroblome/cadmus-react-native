import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ClassCard } from '@/src/features/classes/components/ClassCard';
import { SchoolClass, Shift } from '@/src/features/classes/types/class';

const mockClass: SchoolClass = {
  id: '101',
  schoolId: '1',
  name: '5º Ano A',
  shift: Shift.MORNING,
  academicYear: 2025,
  createdAt: '2024-01-10T08:00:00.000Z',
  updatedAt: '2024-01-10T08:00:00.000Z',
};

describe('ClassCard', () => {
  it('renderiza nome e ano letivo da turma', () => {
    const { getByText } = render(
      <ClassCard schoolClass={mockClass} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('5º Ano A')).toBeTruthy();
    expect(getByText(/2025/)).toBeTruthy();
  });

  it('exibe turno MANHÃ corretamente', () => {
    const { getByText } = render(
      <ClassCard schoolClass={mockClass} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText(/Manhã/)).toBeTruthy();
  });

  it('exibe turno TARDE corretamente', () => {
    const afternoon = { ...mockClass, shift: Shift.AFTERNOON };
    const { getByText } = render(
      <ClassCard schoolClass={afternoon} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText(/Tarde/)).toBeTruthy();
  });

  it('exibe turno NOITE corretamente', () => {
    const night = { ...mockClass, shift: Shift.NIGHT };
    const { getByText } = render(
      <ClassCard schoolClass={night} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText(/Noite/)).toBeTruthy();
  });

  it('chama onEdit ao tocar em Editar', () => {
    const onEdit = jest.fn();
    const { getByText } = render(
      <ClassCard schoolClass={mockClass} onEdit={onEdit} onDelete={jest.fn()} />
    );
    fireEvent.press(getByText('Editar'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('abre Alert de confirmação ao tocar em Excluir', () => {
    const { Alert } = require('react-native');
    jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <ClassCard schoolClass={mockClass} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    fireEvent.press(getByText('Excluir'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Excluir turma',
      expect.stringContaining(mockClass.name),
      expect.any(Array)
    );
  });
});
