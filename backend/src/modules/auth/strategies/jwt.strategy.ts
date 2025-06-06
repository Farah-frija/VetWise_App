import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
//refresh token
//Typically not validated by the JwtStrategy because it is not used to access protected resources directly.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //private config: any;
  constructor(
    private configService: ConfigService,
    private usersService: UtilisateurService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    //this.config = configService.get('jwt');
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        "L'utilisateur n'existe pas ou est désactivé",
      );
    }

    return {
      utilisateur_id: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
    };
  }
}
//dealing with expiration of access token cote client
