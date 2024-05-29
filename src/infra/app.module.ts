import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/infra/auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { envSchema } from './env/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.test'],
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [],
  providers: [EnvService],
})
export class AppModule {}
