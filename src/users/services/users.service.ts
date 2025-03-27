import { Injectable } from '@nestjs/common';;
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}
  
  async findById(id: string): Promise<User|null>{
    const user = this.usersRepository.findOne({ where: { id } })
    return user;
  }
}
