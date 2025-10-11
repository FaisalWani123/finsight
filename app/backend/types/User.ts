export type PublicSchemaUser = {
  id: string; // UUID
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  createdAt: Date;
  updatedAt?: Date | null;
  isMale: boolean;
};

export type OnBoardUserRequest = {
  userId: string
  email: string
  firstName: string
  lastName: string
  username: string
  age: number
  isMale: boolean
}