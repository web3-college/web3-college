export interface Permission {
  id: number;
  name: string;
  action: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  address?: string;
  avatar?: string;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  code?: number;
  msg?: string;
  data?: T;
}

export interface PaginatedData<T> {
  items?: T[];
  total?: number;
  page?: number;
  pageSize?: number;
} 