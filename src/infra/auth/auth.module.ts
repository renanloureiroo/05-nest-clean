import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth-guard'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory: async (envService: EnvService) => {
        const privateKey = envService.get('JWT_PRIVATE_KEY')
        const publicKey = envService.get('JWT_PUBLIC_KEY')

        return {
          publicKey: Buffer.from(publicKey, 'base64'),
          privateKey: Buffer.from(privateKey, 'base64'),
          signOptions: { algorithm: 'RS256', expiresIn: '1d' },
        }
      },
    }),
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
