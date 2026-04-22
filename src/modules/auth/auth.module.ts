import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
  secret: 'superSecretKey',
  signOptions: { expiresIn: '15m' },
}),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}