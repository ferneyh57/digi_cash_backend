import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransformDto } from './dto/create-transform.dto';
import { TransformService } from './transform.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('transform')
@ApiTags('transform')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}
  @Post()
  create(@Body() createTransformDto: CreateTransformDto) {
    return this.transformService.createTransform(createTransformDto);
  }
}
