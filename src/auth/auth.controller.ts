import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  ValidateAccessTokenReq,
  ValidateAccessTokenRes,
  Payload,
  GetAccessTokenReq,
} from './auth.interface'
import * as jwt from 'jsonwebtoken'
import { Cache } from 'cache-manager'
import { AuthStatus } from './enums/auth.enum'

@Controller('auth')
export class AuthController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @GrpcMethod('Auth')
  async getAccessToken(req: GetAccessTokenReq): Promise<string> {
    let token: string

    token = (await this.cacheManager.get(`${req.uid}`)) as string

    if (!token) {
      let payload = {
        uid: req.uid,
      }

      token = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
        expiresIn: '1h',
      })

      await this.cacheManager.set(`${req.uid}`, token, { ttl: 60 * 60 })
    }

    return token
  }

  @GrpcMethod('Auth')
  validateAccessToken(req: ValidateAccessTokenReq): ValidateAccessTokenRes {
    try {
      let payload: Payload = jwt.verify(
        req.token,
        process.env.ACCESS_JWT_SECRET,
      ) as Payload

      return {
        status: AuthStatus.AUTHENTICATED,
        uid: payload.uid,
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError)
        return {
          status: AuthStatus.EXPIRED,
        }
      return {
        status: AuthStatus.UNAUTHENTICATED,
      }
    }
  }
}
