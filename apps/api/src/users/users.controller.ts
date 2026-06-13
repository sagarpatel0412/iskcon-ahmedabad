// src/users/users.controller.ts
import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @UseGuards(AuthTokenGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.usersService.me(req.user.id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('me/password')
  updatePassword(
    @Req() req: any,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(req.user.id, dto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOne(uuid);
  }
}