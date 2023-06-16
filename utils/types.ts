import { ManipulateType } from "dayjs";

export interface SessionState {
  session: string | null;
}

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
}

export interface BurnTimeFrame {
  count: number;
  unit: ManipulateType;
}

export interface SecretData {
  content: string;
  iv: string;
  decryptAttempts: number;
  burnAfter: BurnTimeFrame;
}

export interface Secret extends SecretData {
  id: string;
  uid: string | null;
  createdAt: string;
}

export interface BurnStatus {
  burned: boolean;
  burnWithin: string;
}

export interface WithBurnStatus {
  burnStatus: BurnStatus;
}

export interface SecretWithExtra extends Secret {
  user: User | null;
  burnStatus: BurnStatus;
}

export interface Stats {
  created: number;
  burned: number;
}
