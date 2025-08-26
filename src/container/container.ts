import { Container } from 'inversify';

import { CONTAINER_TYPES } from './types';
import { DevelopersRepository } from '../domain/developers/repositories/developers.repository';
import { DevelopersService } from '../domain/developers/services/developers.service';

import type { AppContainer } from './types';
import type { interfaces } from 'inversify';

import '../rest/controllers/developers.controller';
import '../rest/dto/developers.responses.dto';

export const createContainer = (
  options: CreateContainerOptions = {}
): AppContainer => {
  const container = new Container();

  container
    .bind<DevelopersService>(CONTAINER_TYPES.DevelopersService)
    .to(DevelopersService);
  container
    .bind<DevelopersRepository>(CONTAINER_TYPES.DevelopersRepository)
    .to(DevelopersRepository);

  // for (const serviceIdentifier of _.keys(options.overrides)) {
  //   if (container.isBound(serviceIdentifier)) {
  //     container.unbind(serviceIdentifier);
  //   }

  //   if (options.overrides[serviceIdentifier].toConstantValue) {
  //     container
  //       .bind(serviceIdentifier)
  //       .toConstantValue(options.overrides[serviceIdentifier].toConstantValue);
  //   }

  //   if (options.overrides[serviceIdentifier].to) {
  //     container
  //       .bind(serviceIdentifier)
  //       .to(options.overrides[serviceIdentifier].to);
  //   }
  // }

  const mergedContainer = options.mergeContainer
    ? Container.merge(container, options.mergeContainer)
    : container;

  if (options.applicableMiddleware?.apply) {
    options.applicableMiddleware.apply(mergedContainer);
  }

  return mergedContainer;
};

export interface CreateContainerOptions {
  mergeContainer?: Container;
  applicableMiddleware?: {
    apply(container: Container | interfaces.Container): void;
  };
}
