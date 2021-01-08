import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import * as jwt from 'jsonwebtoken'
import { GetAccessTokenReq, Payload } from './auth.interface'
import { ConfigModule } from '@nestjs/config'
import { timer } from 'rxjs'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [ConfigModule.forRoot()],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('AccessToken', () => {
    it('should return access token', () => {
      let req: GetAccessTokenReq = {
        uid: 1,
      }

      let accessToken = controller.getAccessToken(req)

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

      let accessToken = controller.getAccessToken(req)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      let cachedToken = controller.getAccessToken(req)

      expect(accessToken).toEqual(cachedToken)
    })
  })
})
