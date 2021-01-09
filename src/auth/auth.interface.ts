import { AuthStatus } from './enums/auth.enum'

export interface ValidateAccessTokenReq {
  token: string
}

export interface ValidateAccessTokenRes {
  status: AuthStatus
  uid?: number
}

export interface Payload {
  uid: number
}

export interface GetAccessTokenReq {
  uid: number
}
