import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { LocalStorage } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStorage } from './strategy/jwt.strategy';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const jwt = configService.get('jwt');
    return {
      secret: jwt.secret,
      signOptions: { expiresIn: jwt.expiresIn },
    };
  },
});
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    jwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage],
  exports: [JwtStorage],
})
export class AuthModule {}
