import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  requestParam,
} from 'inversify-express-utils';
import { Get, Query, Res, Route } from 'tsoa';

import { CONTAINER_TYPES } from '../../container/types';
import { DeveloperDto } from '../dto/developers.responses.dto';

import type { DevelopersService } from '../../domain/developers/services/developers.service';
import type { Response } from 'express';
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
    @Res() res: Response,
    @Query() email?: string,
    @Query() name?: string
  ): Promise<void> {
    const data = await this.developersService.getDevelopers({ email, name });
    res.render('developers', {
      layout: 'main',
      developers: data.map(DeveloperDto.fromDbDeveloper),
    });
  }

  @Get('{id}')
  @httpGet('/:id')
  public async getDeveloperById(
    @requestParam('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    const data = await this.developersService.getDeveloperById(id);
    res.render('developer-details', {
      layout: 'main',
      developer: data,
    });
  }
}
