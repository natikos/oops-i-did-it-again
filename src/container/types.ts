import type { Container, interfaces } from 'inversify';

export const CONTAINER_TYPES = {
  DevelopersService: Symbol.for('DevelopersService'),
  DevelopersRepository: Symbol.for('DevelopersRepository'),
};

export type AppContainer = Container | interfaces.Container;
