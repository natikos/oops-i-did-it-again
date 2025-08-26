import { Example } from 'tsoa';

import type { GetDevelopersFilters } from '../../domain/developers/repositories/types';

export class DeveloperFiltersDto implements GetDevelopersFilters {
  @Example('john.doe@mail.com') email?: string;
  @Example('John') name?: string;
}
