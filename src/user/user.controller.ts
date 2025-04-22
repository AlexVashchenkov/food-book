import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Sse,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { catchError, EMPTY, fromEvent, map, Observable } from 'rxjs';
import { EventEmitter2 } from 'eventemitter2';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Sse('events') // Делаем эндпоинт /users/events
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'user.change').pipe(
      map((data: any) => {
        const response = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
          type: data.type,
          user: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            id: data.user.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            name: data.user.name,
          },
        };
        return { data: JSON.stringify(response) } as MessageEvent;
      }),
      catchError((err) => {
        console.error('SSE error:', err);
        return EMPTY;
      }),
    );
  }

  // Helper method to emit events
  private emitUserEvent(type: string, user: any) {
    this.eventEmitter.emit('user.event', {
      type,
      user: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        name: user.name,
      },
    });
  }

  @Get()
  @Render('users')
  async getAllUsers() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('add')
  @Render('add-user')
  addUserForm() {
    return {};
  }

  @Get(':id')
  @Render('user-profile')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }

  @Get(':id/edit')
  @Render('patch-user')
  async editUserForm(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }

  @Get(':id/dish')
  @Render('dishes')
  async getUserDishes(@Param('id') id: string) {
    const dishes = await this.userService.getUserDishes(+id);
    return { dishes };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.photo = file.filename;
    }

    const user = await this.userService.create(createUserDto);
    this.emitUserEvent('create', user);
    return res.redirect('/users');
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.photo = file.filename;
    }

    await this.userService.update(+id, updateUserDto);

    return res.redirect('/users');
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(+id);
      await this.userService.remove(+id);

      this.emitUserEvent('delete', user);
      return res.redirect('/users');
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).send('Error deleting user');
    }
  }
}
