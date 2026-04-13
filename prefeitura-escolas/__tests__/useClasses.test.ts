import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useClasses } from "@/src/features/classes/hooks/useClasses";
import { useClassesStore } from "@/src/features/classes/store/classesStore";
import { SchoolClass, Shift } from "@/src/features/classes/types/class";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@/src/features/classes/services/classesService", () => ({
  classesService: {
    getBySchool: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("@/src/features/schools/store/schoolsStore", () => ({
  useSchoolsStore: {
    getState: () => ({ updateClassCount: jest.fn() }),
  },
}));

const {
  classesService,
} = require("@/src/features/classes/services/classesService");

const mockClasses: SchoolClass[] = [
  {
    id: "101",
    schoolId: "1",
    name: "5º Ano A",
    shift: Shift.MORNING,
    academicYear: 2025,
    createdAt: "2024-01-10T08:00:00.000Z",
    updatedAt: "2024-01-10T08:00:00.000Z",
  },
  {
    id: "102",
    schoolId: "1",
    name: "6º Ano B",
    shift: Shift.AFTERNOON,
    academicYear: 2025,
    createdAt: "2024-01-10T08:10:00.000Z",
    updatedAt: "2024-01-10T08:10:00.000Z",
  },
  {
    id: "103",
    schoolId: "1",
    name: "EJA - Turma 1",
    shift: Shift.NIGHT,
    academicYear: 2024,
    createdAt: "2024-01-10T08:20:00.000Z",
    updatedAt: "2024-01-10T08:20:00.000Z",
  },
];

beforeEach(() => {
  useClassesStore.setState({
    classes: [],
    cachedSchoolId: null,
    isLoading: false,
    error: null,
    isOffline: false,
  });
  jest.clearAllMocks();
});

describe("useClasses", () => {
  it("carrega turmas da escola ao montar", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() => useClasses({ schoolId: "1" }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classes).toHaveLength(3);
  });

  it("filtra turmas por turno", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() =>
      useClasses({ schoolId: "1", shiftFilter: Shift.MORNING }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].shift).toBe(Shift.MORNING);
  });

  it("filtra turmas por ano letivo", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() =>
      useClasses({ schoolId: "1", yearFilter: 2024 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].academicYear).toBe(2024);
  });

  it("filtra por turno e ano letivo simultaneamente", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() =>
      useClasses({
        schoolId: "1",
        shiftFilter: Shift.AFTERNOON,
        yearFilter: 2025,
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].name).toBe("6º Ano B");
  });

  it("calcula availableYears corretamente", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() => useClasses({ schoolId: "1" }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.availableYears).toContain(2024);
    expect(result.current.availableYears).toContain(2025);
    expect(result.current.availableYears).toHaveLength(2);
  });

  it("adiciona nova turma ao estado", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);
    const newClass: SchoolClass = {
      id: "104",
      schoolId: "1",
      name: "7º Ano C",
      shift: Shift.MORNING,
      academicYear: 2025,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    classesService.create.mockResolvedValueOnce(newClass);

    const { result } = renderHook(() => useClasses({ schoolId: "1" }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.create({
        schoolId: "1",
        name: "7º Ano C",
        shift: Shift.MORNING,
        academicYear: 2025,
      });
    });

    expect(useClassesStore.getState().classes).toHaveLength(4);
  });

  it("remove turma do estado", async () => {
    classesService.getBySchool.mockResolvedValueOnce(mockClasses);
    classesService.remove.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useClasses({ schoolId: "1" }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.remove("101");
    });

    expect(useClassesStore.getState().classes).toHaveLength(2);
  });
});
