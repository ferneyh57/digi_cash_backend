import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/config/interfaces/jwt-payload.interface';
import { User } from 'src/config/db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);
    return { access_token, refresh_token };
  }

  async signUp(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.usersService.create(registerDto);
    const access_token = this.generateAccessToken(newUser);
    const refresh_token = this.generateRefreshToken(newUser);
    return { access_token, refresh_token };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  private generateRefreshToken(user: User): string {
    const payload: JwtPayload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
