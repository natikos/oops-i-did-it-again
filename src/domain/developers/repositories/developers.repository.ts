// **************************************************************************
// Репозиторій імітує шар підключення до бази данних. Данні знаходяться в data.ts
// **************************************************************************

import { injectable } from 'inversify';

import { contracts, developers } from './data';

import type { IDeveloper } from '../types';

@injectable()
export class DevelopersRepository {
  async getDevelopers(): Promise<IDeveloper[]> {
    return developers;
  }

  async getDeveloperById(id: string): Promise<IDeveloper> {
    return developers.find((d) => d.id === id);
  }

  async getContracts() {
    return contracts;
  }
}
