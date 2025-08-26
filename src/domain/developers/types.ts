import type { contracts } from './repositories/data';

export interface DbDeveloper {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contracts: (typeof contracts)[number][];
}

export interface DeveloperWithRevenue extends DbDeveloper {
  revenue: number;
}
