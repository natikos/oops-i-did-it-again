import { inject } from 'inversify';
import {
  controller,
  BaseHttpController,
  httpGet,
  requestParam,
} from 'inversify-express-utils';
import { Get, Query, Route } from 'tsoa';

import { CONTAINER_TYPES } from '../../container/types';
import { DeveloperDto } from '../dto/developers.responses.dto';

import type { DevelopersService } from '../../domain/developers/services/developers.service';
import type { DeveloperFiltersDto } from '../dto/developers.query.dto';
import type { NextFunction, Request, Response } from 'express';
import type { interfaces } from 'inversify-express-utils';

@Route('developers')
@controller('/api/developers')
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
    _req: Request,
    res: Response,
    _next: NextFunction,
    @Query() filters: DeveloperFiltersDto = {}
  ): Promise<void> {
    console.log('here', filters);
    const data = await this.developersService.getDevelopers(filters);
    res.render('developers', {
      layout: 'main',
      developers: data.map(DeveloperDto.fromDbDeveloper),
    });
  }

  @Get('{id}')
  @httpGet('/:id')
  public async getDeveloperById(
    @requestParam('id') id: string,
    _req: Request,
    res: Response
  ): Promise<void> {
    const data = await this.developersService.getDeveloperById(id);
    console.log('id', id);
    res.render('developer-details', {
      layout: 'main',
      developer: data,
    });
  }
}
