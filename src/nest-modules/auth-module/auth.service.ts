import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtServivce: JwtService) {}

  login(email: string, password: string) {
    const payload = {
      email,
      password,
      name: 'test',
    };

    return {
      access_token: this.jwtServivce.sign(payload),
    };
  }
}
