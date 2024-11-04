import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) { }


    logger = new Logger(TasksService.name);

    async listTasks(userID: string) {
        const tasks = await this.tasksRepository.find({ where: { owner: { id: userID } } });

        return tasks;
    }


    async getTask(id: string, userID: string) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .where(`task.id = "${id}"`)
            .andWhere('task.owner.id = userID', { id, userID })
            .getOne();

        if (!task) {
            this.logger.warn('Task not found.');
            throw new NotFoundException('No tasks were found for this ID.');
        }

        return task;
    }


    async getCompleteTask(id: string) {

        try {
            const task = await this.tasksRepository.createQueryBuilder('task')
                .leftJoinAndSelect('task.owner', 'owner')
                .where(`task.id = ${id}`)
                .getOne();

            return task;

        } catch {
            throw new NotFoundException('No tasks were found for this ID.');
        }
    }


    async editTask(body: any, userID: string) {

        try {
            await this.tasksRepository.update(body.id, body);

            const editedTask = await this.getTask(body.id, userID);

            return editedTask;

        } catch {
            throw new InternalServerErrorException('There was an error editing this task.')
        }
    }
}
