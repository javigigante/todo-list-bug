import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksCheckGuard } from './taskscheck.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get('all')
    async listTasks(userID: string) {
        return this.tasksService.listTasks(userID);
    }

    @UseGuards(AuthGuard, TasksCheckGuard)
    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req) {
        const userID = req.user.id;
        const task = await this.tasksService.getTask(id, userID);

        return task;
    }

    @UseGuards(AuthGuard, TasksCheckGuard)
    @Post('/edit')
    async editTask(@Body() body, @Request() req) {
        const userID = req.user.id;
        return this.tasksService.editTask(body, userID);
    }
}
