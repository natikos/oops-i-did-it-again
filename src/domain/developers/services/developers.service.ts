import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { CONTAINER_TYPES } from '../../../container/types';

import type { contracts } from '../repositories/data';
import type { DevelopersRepository } from '../repositories/developers.repository';
import type { GetDevelopersFilters } from '../repositories/types';
import type { DeveloperOverview, DeveloperWithRevenue } from '../types';

@injectable()
export class DevelopersService {
  constructor(
    @inject(CONTAINER_TYPES.DevelopersRepository)
    private developersRepository: DevelopersRepository
  ) {}

  async getDevelopers(
    filter: GetDevelopersFilters
  ): Promise<DeveloperOverview[]> {
    const devs = await this.developersRepository.getDevelopers(filter);

    return devs.map(({ contracts, ...dev }) => ({
      ...dev,
      revenue: this.calculateRevenue(contracts),
    }));
  }

  async getDeveloperById(id: string): Promise<DeveloperWithRevenue | null> {
    const dev = await this.developersRepository.getDeveloperById(id);

    if (!dev) {
      return null;
    }

    return { ...dev, revenue: this.calculateRevenue(dev.contracts) };
  }

  private calculateRevenue(
    devContracts: Pick<(typeof contracts)[number], 'amount'>[]
  ): number {
    return _.sumBy(devContracts, 'amount');
  }
}
