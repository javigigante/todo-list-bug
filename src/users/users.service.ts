import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async create(body: any) {
        const user = new User();
        user.email = body.email;
        user.pass = body.pass;
        user.fullname = body.fullname;        

        await this.usersRepository.save(user);

        return user;
            /*
        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);
        this.logger.log(token);
            */                
    }

    async findOne(email: string) {
        const user = await this.usersRepository.findOneBy({ email });

        return user;
    }
}
