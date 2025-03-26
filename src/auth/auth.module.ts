import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [HashModule],
  providers: [],
  exports: [],
})
export class AuthModule {}