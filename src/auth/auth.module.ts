import * as redisStore from 'cache-manager-redis-store'
import { CacheModule, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
