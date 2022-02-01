import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const [user] = await this.usersService.find(email); 
    if(user) throw new BadRequestException('email in use');
    
    // Hash ther users password
    // Generate a salt

    const salt = randomBytes(8).toString('hex');
    // Hash the salt and password
    const hash =( await scrypt(password, salt, 32)) as Buffer;

    // JOin the hashed result and salt together
    const hastedPassword = salt + '.' + hash.toString('hex');
    
    // Create a new user and save it
    const userInfo = await this.usersService.create(email, hastedPassword);
    
    // return the user
    return userInfo;
  }

  async signin(email: string, password: string) {
    
    const [user] = await this.usersService.find(email);
    if(!user) throw new NotFoundException('User Not found');
    
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if(storedHash !== hash.toString('hex'))  throw new BadRequestException('Bad password');

    return user;
  }

  
  
}
