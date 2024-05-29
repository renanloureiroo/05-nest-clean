import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  })
  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port, () =>
    console.log(`Sever running: http://localhost:3333`),
  )
}
bootstrap()
