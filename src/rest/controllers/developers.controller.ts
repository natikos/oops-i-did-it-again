import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  queryParam,
  requestParam,
} from 'inversify-express-utils';
import { Get, Query, Route } from 'tsoa';

import { CONTAINER_TYPES } from '../../container/types';

import type { DevelopersService } from '../../domain/developers/services/developers.service';
import type { DeveloperDetailsDto } from '../dto/developer.responses.dto';
import type { DeveloperDto } from '../dto/developers.responses.dto';
import type { interfaces } from 'inversify-express-utils';

@controller('/api/developers')
@Route('/api/developers')
export class DevelopersController
  extends BaseHttpController
  implements interfaces.Controller
{
  constructor(
    @inject(CONTAINER_TYPES.DevelopersService)
    private developersService: DevelopersService
  ) {
    super();
  }

  @Get('/')
  @httpGet('/')
  public async getDevelopers(
    @Query('email')
    @queryParam('email')
    email?: string,
    @Query('name')
    @queryParam('name')
    name?: string
  ): Promise<DeveloperDto[]> {
    return this.developersService.getDevelopers({ email, name });
  }

  @Get('{id}')
  @httpGet(':id')
  public async getDeveloperById(
    @requestParam('id') id: string
  ): Promise<DeveloperDetailsDto | null> {
    return this.developersService.getDeveloperById(id);
  }
}
