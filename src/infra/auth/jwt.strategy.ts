import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { z } from 'zod'
import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly envService: EnvService) {
    const publicKey = envService.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}

export { JwtStrategy }
