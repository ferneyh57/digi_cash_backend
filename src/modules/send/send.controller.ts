import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SendService } from './send.service';
import { CreateSendToAddressDto } from './dto/create-send-to-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateSendToUsernameDto } from './dto/create-send-to-username.dto';

@Controller('send')
@ApiTags('send')
export class SendController {
  constructor(private readonly sendService: SendService) {}
  @Post('address')
  createToAddress(
    @Body() createSendToAddressDto: CreateSendToAddressDto,
    @Req() request: Request,
  ) {
    const id = request.user.id;
    return this.sendService.createSendToAddress(createSendToAddressDto, id);
  }
  @Post('username')
  createToUsername(
    @Body() createSendToUsernameDto: CreateSendToUsernameDto,
    @Req() request: Request,
  ) {
    const id = request.user.id;
    return this.sendService.createSendToUsername(createSendToUsernameDto, id);
  }
}
