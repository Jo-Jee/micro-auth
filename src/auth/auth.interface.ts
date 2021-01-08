export interface ValidateAccessTokenReq {
  token: string
}

export interface ValidateAccessTokenRes {
  status: string
  uid?: number
}

export interface Payload {
  uid: number
}

export interface GetAccessTokenReq {
  uid: number
}
