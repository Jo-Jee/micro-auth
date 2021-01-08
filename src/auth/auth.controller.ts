import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  ValidateAccessTokenReq,
  ValidateAccessTokenRes,
  Payload,
  GetAccessTokenReq,
} from './auth.interface'
import * as jwt from 'jsonwebtoken'

@Controller('auth')
export class AuthController {
  @GrpcMethod('Auth')
  getAccessToken(req: GetAccessTokenReq): string {
    let payload = {
      uid: req.uid,
    }

    return jwt.sign(payload, process.env.ACCESS_JWT_SECRET, { expiresIn: '1h' })
  }

  @GrpcMethod('Auth')
  validateAccessToken(req: ValidateAccessTokenReq): ValidateAccessTokenRes {
    try {
      let payload: Payload = jwt.verify(
        req.token,
        process.env.ACCESS_JWT_SECRET,
      ) as Payload

      return {
        status: 'AUTHENTICATED',
        uid: payload.uid,
      }
    } catch (e) {
      return {
        status: 'UNAUTHENTICATED',
      }
    }
  }
}
