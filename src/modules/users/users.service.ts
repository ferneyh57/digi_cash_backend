import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/config/db/entities/user.entity';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { SpentSeeder } from '../spent/spent.seeder';
import { Coin } from 'src/config/db/entities/coin.entity';
import { CoinType } from 'src/config/enums/coin-type.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private spentSeeder: SpentSeeder,
    @InjectRepository(Coin)
    private coinRepository: Repository<Coin>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async test(){console.log('hola')}
  async findByEmail(email: string): Promise<User | null> {

    return this.usersRepository.findOneBy({ email: email });
  }

  async create(registerDto: RegisterDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);
      const username = Math.random().toString(36).substring(2, 10);

      const newUser = this.usersRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        username: username,
      });

      const savedUser = await this.usersRepository.save(newUser);
      const coin = await this.coinRepository.findOneBy({ type: CoinType.COP });
      if (!coin) {
        throw new NotFoundException('Coin type COP not found');
      }
      const wallet = this.walletRepository.create({
        user: newUser,
        coin: coin,
      });
      await this.walletRepository.save(wallet);

      await this.spentSeeder.seed(savedUser);

      return savedUser;
    } catch (error) {
      throw new BadRequestException('Invalid request: ' + error.message);
    }
  }
}
