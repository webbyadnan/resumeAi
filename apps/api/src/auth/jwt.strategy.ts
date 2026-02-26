import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Supabase JWT secrets are base64url-encoded — decode to raw bytes for passport-jwt
const rawSecret = Buffer.from(
    process.env.SUPABASE_JWT_SECRET || '',
    'base64',
);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: rawSecret,
            algorithms: ['HS256'],
        });
    }

    async validate(payload: any) {
        if (!payload?.sub) throw new UnauthorizedException();
        return { id: payload.sub, email: payload.email };
    }
}
