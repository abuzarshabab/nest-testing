import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { find } from 'rxjs/operators';

let fakeUserService: Partial<UsersService>;

describe('AuthService', () => {
    let service: AuthService;

    beforeEach( async() => {
        // Create a fake copy of the users service
        fakeUserService = {
           find: () => Promise.resolve([]),
           create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
       }
    
        const module = await Test.createTestingModule({
           providers: [
               AuthService,
               {
                   provide: UsersService,
                   useValue: fakeUserService,
               }
           ],
        }).compile();
        service = module.get(AuthService);
    })
   
    it('Can create an instance of auth service', async () => {
       expect(service).toBeDefined();
    })

    it('Should create a new user with hasted password', async() => {
       const user = await service.signup('Shabab@gmail.com', '12345@gmail');
       const [salt, hash] = user.password.split('.');

       expect(user.password).not.toEqual('12345@gmail');
       expect(salt).toBeDefined();
       expect(hash).toBeDefined();
    })

    it('Should throws an error if user signed in with an email that is used email', async(done) => {
        fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'Abuzar@gmail.com', password: '235'} as User]);

        try{
           await service.signin('Abuzar@gmail.com', '12345@12345');
        }catch (err) {
           done();
        }
    })

    it('Should throws if signed in l', async (done) => {
        fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'Abuzar@gmail.com', password: '235'} as User]);

        try{
           await service.signin('Abuzar@gmail.com', '12345@12345');
        }catch (err) {
           done();
        }
    })

    it('should throws an error if invalid password provided', async (done) => {
        fakeUserService.find = () => Promise.resolve([{ email: 'abuzarshabab@gmail.com', password: 'right_password' } as User]);
        try {
            await service.signin('abuzarshabab@gmail.com', 'right_password');
            done();
        } catch(err) {
            done();
        }
    })

    it('Should returns a user if correct password is provided', async() => {
        
        fakeUserService.find = () => Promise.resolve([
            {
                email: 'test@gmail.com',
                password: '0d2455e3032c12a0.60af4f7c13e33ff7b249cecc3e329ba09ed0ed012426541823b7077e854914e8'
            } as User]);

        const user = await service.signin('test@gmail.com', 'right_password');
        expect(user).toBeDefined();
    })


})

// { email: 'abuzarshabab@gmail.com', password:'abuzar', id: '1' }, { email: 'devabuzar@gmail.com', password:'devAbuzar', id: '1' } 