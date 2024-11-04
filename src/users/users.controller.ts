import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/email')
    async getUserByEmail(email) {
        return this.usersService.findOne(email);
    }

    @Post('/create')
    async create(@Body() body) {
        return this.usersService.create(body);
    }
}
