import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import * as jwt from 'jsonwebtoken'
import { GetAccessTokenReq, Payload } from './auth.interface'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register({
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('AccessToken', () => {
    it('should return access token', async () => {
      let req: GetAccessTokenReq = {
        uid: 1,
      }

      let accessToken = await controller.getAccessToken(req)

      let payload: Payload = jwt.verify(
        accessToken,
        process.env.ACCESS_JWT_SECRET,
      ) as Payload

      expect(payload.uid).toEqual(req.uid)
    })

    it('should return redis cached token', async () => {
      let req: GetAccessTokenReq = {
        uid: 1,
      }

      let accessToken = await controller.getAccessToken(req)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      let cachedToken = await controller.getAccessToken(req)

      expect(accessToken).toEqual(cachedToken)
    })
  })
})
