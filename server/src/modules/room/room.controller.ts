import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from 'src/decorators/role.decorator';
import AuthGuard from '../auth/guards/auth.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  // @UseGuards(AuthGuard)
  // @Roles('admin')
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
