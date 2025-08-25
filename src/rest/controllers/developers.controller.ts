import { inject } from 'inversify';
import {
  controller,
  BaseHttpController,
  httpGet,
  requestParam,
} from 'inversify-express-utils';

import type { DevelopersService } from '../../domain/developers/services/developers.service';
import type { DeveloperDto } from '../dto/developers.responses.dto';
import type { interfaces } from 'inversify-express-utils';

@controller('/api/developers')
// @ApiPath(path)
export class DevelopersController
  extends BaseHttpController
  implements interfaces.Controller
{
  constructor(
    @inject('DevelopersService') private developersService: DevelopersService
  ) {
    super();
  }

  @httpGet('/')
  // @ApiOperationGet(getDevelopers)
  public async getDevelopers(): Promise<DeveloperDto[]> {
    return this.developersService.getDevelopers();
  }

  @httpGet('/:id')
  // @ApiOperationGet(getDeveloperById)
  public async getDeveloperById(
    @requestParam('id') id: string
  ): Promise<DeveloperDto> {
    return this.developersService.getDeveloperById(id);
  }
}
