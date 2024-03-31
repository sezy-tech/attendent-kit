import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies[process.env.COOKIE_ACCESS_TOKEN_KEY];
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_AT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
