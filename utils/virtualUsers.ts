export type UserRole = "admin" | "user";

export interface User {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  address?: string;
}

// Predefined users
const users: User[] = [
  {
    username: "Christoffel",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "user",
    email: "user@example.com",
    password: "user1234",
    role: "user",
  },
];

export function findUser(username: string, password: string): User | undefined {
  return users.find((u) => u.username === username && u.password === password);
}

export function addUser(user: User): boolean {
  if (
    users.some((u) => u.username === user.username || u.email === user.email)
  ) {
    return false; // User already exists
  }
  users.push(user);
  return true;
}

export function getUserRole(username: string): UserRole | undefined {
  return users.find((u) => u.username === username)?.role;
}
