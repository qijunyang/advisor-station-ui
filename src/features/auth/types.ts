export interface Advisor {
  readonly id: string;
  readonly name: string;
}

export interface Firm {
  readonly id: string;
  readonly name: string;
  readonly advisors: readonly Advisor[];
}

export interface AuthSession {
  readonly version: 1;
  readonly firmId: string;
  readonly advisorId: string;
  readonly sessionId: string;
}
