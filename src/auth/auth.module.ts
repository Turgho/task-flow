import { Module } from '@nestjs/common';
import { PasswordHasherModule } from '../users/services/passwordHasher/passwordHasher.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Module({
  imports: [
    PasswordHasherModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule],
})
export class AuthModule {}