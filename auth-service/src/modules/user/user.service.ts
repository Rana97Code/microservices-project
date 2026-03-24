import { Injectable } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import * as typegoose from '@typegoose/typegoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typegoose.ReturnModelType<typeof User>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}