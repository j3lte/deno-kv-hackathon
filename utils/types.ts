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
  encrypted: boolean;
  burnAfterReading: boolean;
  expiresAt: string | null;
}

export interface Secret extends SecretData {
  id: string;
  uid: string | null;
}
