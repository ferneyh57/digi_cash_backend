import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Features } from 'src/config/db/entities/feature.entity';
import { FeaturesSeeder } from './features.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Features])],
  providers: [FeaturesService,FeaturesSeeder],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}
