// **************************************************************************
// Репозиторій імітує шар підключення до бази данних. Данні знаходяться в data.ts
// **************************************************************************

import { injectable } from 'inversify';
import _ from 'lodash';

import { contracts, developers } from './data';

import type { GetDevelopersFilters } from './types';
import type { DbDeveloper } from '../types';

@injectable()
export class DevelopersRepository {
  async getDevelopers(filters: GetDevelopersFilters): Promise<DbDeveloper[]> {
    const contractsByDeveloper = _.groupBy(contracts, 'developerId');

    const matchedDevelopers = developers.reduce<DbDeveloper[]>((acc, d) => {
      const matchesName = filters.name
        ? d.firstName.includes(filters.name) ||
          d.lastName.includes(filters.name)
        : true;

      const matchesEmail = filters.email
        ? d.email.includes(filters.email)
        : true;

      if (matchesName && matchesEmail) {
        acc.push({ ...d, contracts: contractsByDeveloper[d.id] ?? [] });
      }
      return acc;
    }, []);

    return matchedDevelopers;
  }

  async getDeveloperById(id: string): Promise<DbDeveloper | null> {
    const dev = developers.find((d) => d.id === id) ?? null;
    if (!dev) {
      return null;
    }
    const devContracts = contracts.filter((item) => item.developerId === id);
    return { ...dev, contracts: devContracts };
  }

  async getContracts() {
    return contracts;
  }
}
