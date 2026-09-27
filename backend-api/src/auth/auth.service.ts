import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: { id: number; email: string; password: string }[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(email: string, password: string) {
    const existing = this.users.find((u) => u.email === email);
    if (existing) {
      throw new UnauthorizedException('البريد مستخدم مسبقاً');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    this.users.push(newUser);
    return { id: newUser.id, email: newUser.email };
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { access_token: token };
  }
}
