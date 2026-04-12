export interface School {
  id: string;
  name: string;
  address: string;
  classCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolInput {
  name: string;
  address: string;
}

export interface UpdateSchoolInput {
  name?: string;
  address?: string;
}
