import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TasksCheckGuard } from './taskscheck.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Task])],
    controllers: [TasksController],
    providers: [AuthGuard, TasksCheckGuard, TasksService],
})
export class TasksModule {}
