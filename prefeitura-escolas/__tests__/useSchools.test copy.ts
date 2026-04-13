import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSchools } from '@/src/features/schools/hooks/useSchools';
import { useSchoolsStore } from '@/src/features/schools/store/schoolsStore';
import { School } from '@/src/features/schools/types/school';

// Mock do AsyncStorage para o Zustand persist não quebrar nos testes
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock do serviço — os testes de hook não devem depender de fetch real
jest.mock('@/src/features/schools/services/schoolsService', () => ({
  schoolsService: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

const { schoolsService } = require('@/src/features/schools/services/schoolsService');

const mockSchools: School[] = [
  {
    id: '1',
    name: 'E.M. Professor João Silva',
    address: 'Rua das Flores, 123',
    classCount: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'E.M. Maria das Graças',
    address: 'Av. Brasil, 456',
    classCount: 1,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

beforeEach(() => {
  // Reseta o store entre testes
  useSchoolsStore.setState({ schools: [], isLoading: false, error: null, isOffline: false });
  jest.clearAllMocks();
});

describe('useSchools', () => {
  it('carrega lista de escolas ao montar', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.schools).toHaveLength(2);
    expect(result.current.schools[0].name).toBe('E.M. Professor João Silva');
  });

  it('filtra escolas por nome ao passar searchQuery', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools('Maria'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.schools).toHaveLength(1);
    expect(result.current.schools[0].name).toBe('E.M. Maria das Graças');
  });

  it('filtra escolas por endereço ao passar searchQuery', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools('Brasil'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.schools).toHaveLength(1);
    expect(result.current.schools[0].address).toContain('Brasil');
  });

  it('retorna lista vazia quando busca não encontra nada', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools('xyz não existe'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.schools).toHaveLength(0);
  });

  it('cria escola e adiciona ao estado', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);
    const newSchool: School = {
      id: '3',
      name: 'Nova Escola',
      address: 'Rua Nova, 1',
      classCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    schoolsService.create.mockResolvedValueOnce(newSchool);

    const { result } = renderHook(() => useSchools());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.create({ name: 'Nova Escola', address: 'Rua Nova, 1' });
    });

    expect(result.current.schools).toHaveLength(3);
  });

  it('remove escola do estado', async () => {
    schoolsService.getAll.mockResolvedValueOnce(mockSchools);
    schoolsService.remove.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSchools());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.remove('1');
    });

    expect(result.current.schools).toHaveLength(1);
    expect(result.current.schools[0].id).toBe('2');
  });

  it('define isOffline quando fetch falha e há cache', async () => {
    // Pré-popula o cache no store
    useSchoolsStore.setState({ schools: mockSchools });
    schoolsService.getAll.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSchools());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isOffline).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.schools).toHaveLength(2);
  });

  it('define error quando fetch falha sem cache', async () => {
    schoolsService.getAll.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSchools());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.isOffline).toBe(false);
  });
});
