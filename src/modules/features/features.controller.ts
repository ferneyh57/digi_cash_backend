import { Controller, Get } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { Features } from 'src/config/db/entities/feature.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('features')
@ApiTags('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}
  @Get()
  async getAllFeatures(): Promise<Features[]> {
    return this.featuresService.findAll();
  }
}
