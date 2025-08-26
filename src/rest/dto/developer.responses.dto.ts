import type { contracts } from '../../domain/developers/repositories/data';
import type { DeveloperWithRevenue } from '../../domain/developers/types';

export class DeveloperDetailsDto implements DeveloperWithRevenue {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  revenue!: number;
  contracts!: (typeof contracts)[number][];
}
