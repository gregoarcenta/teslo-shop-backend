import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from '../swagger/decorators/api-error-responses.decorator';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Execute seed for the initial data' })
  @ApiOkResponse({
    description: 'Seed has been successfully executed.',
    example: 'Execute Seed',
  })
  @ApiErrorResponses({
    badRequest: true,
    internalServerError: true,
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
