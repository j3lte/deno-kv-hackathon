export interface SessionState {
  session: string | null;
}

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
}

export interface SecretData {
  content: string;
  iv: string;
  decryptAttempts: number;
}

export interface Secret extends SecretData {
  id: string;
  uid: string | null;
  createdAt: string;
}

export interface SecretWithUser extends Secret {
  user: User | null;
}
