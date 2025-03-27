import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./shared/database/database.config";
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot(),
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}