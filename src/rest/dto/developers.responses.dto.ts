import type {
  DeveloperOverview,
  DeveloperWithRevenue,
} from '../../domain/developers/types';

export class DeveloperDto implements Omit<DeveloperWithRevenue, 'contracts'> {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  revenue!: number;

  static fromDbDeveloper(dbDev: DeveloperOverview): DeveloperDto {
    const dto = new DeveloperDto();
    dto.id = dbDev.id;
    dto.firstName = dbDev.firstName;
    dto.lastName = dbDev.lastName;
    dto.email = dbDev.email;
    dto.revenue = dbDev.revenue;
    return dto;
  }
}
