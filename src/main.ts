import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: process.env.PACKAGE_NAME,
        protoPath: join(
          __dirname,
          `${process.env.PACKAGE_NAME}/${process.env.PACKAGE_NAME}.proto`,
        ),
        url: `0.0.0.0:${process.env.PORT}`,
      },
    },
  )
  await app.listenAsync()
}
bootstrap()
