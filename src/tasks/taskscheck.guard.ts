import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { error } from 'console';

@Injectable()
export class TasksCheckGuard implements CanActivate {

  constructor(private readonly tasksService: TasksService) { };

  logger = new Logger(TasksCheckGuard.name);

  async canActivate(context: ExecutionContext,): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const userID = req.user?.id;
    const taskID = req.params.id;

    if (!userID) {
      this.logger.warn('User attempting to log in without authentication.');
      throw new UnauthorizedException('User not logged.');
    }

    if (!taskID) {
      this.logger.warn('Task ID not found.');
      throw new NotFoundException('Task ID is needed.');
    }

    try {
      const task = await this.tasksService.getCompleteTask(taskID);

      if (!task) {
        this.logger.warn('Task not found.');
        throw new NotFoundException('Task not found.')
      }

      if (task.owner.id !== userID) {
        this.logger.warn('User trying to get resources without permission.');
        throw new UnauthorizedException('User has not permission to get this resource.');
      }

      return true;

    } catch (e) {
      throw e;
    }
  }
}
