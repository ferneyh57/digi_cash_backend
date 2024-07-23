import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spent } from 'src/config/db/entities/spent.entity';
import { SpentService } from './spent.service';
import { SpentController } from './spent.controller';
import { SpentSeeder } from './spent.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Spent])],
  providers: [SpentService,SpentSeeder],
  exports: [SpentService],
  controllers: [SpentController],
})
export class SpentModule {}
