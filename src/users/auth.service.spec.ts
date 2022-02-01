import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { find } from 'rxjs/operators';

let fakeUserService: Partial<UsersService>;

describe('AuthService', () => {
    let service: AuthService;

    beforeEach( async() => {
        const users: User[] = [];

        // Create a fake copy of the users service
        fakeUserService = {
            find: (email: string) => {
                const fileterdUser = users.filter( user => user.email === email);
                return Promise.resolve(fileterdUser);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user)
            } 
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

    it('Should throws an error if user signed up with an email that is used email', async(done) => {
        await service.signup('Abuzar@gmail.com', '12345@12345');  // Insert email

        try{
           await service.signup('Abuzar@gmail.com', '12345@12345');  // Reinsert Email
        }catch (err) {
           done();
        }
    })

    // it('Should throws if signed in l', async (done) => {
    //     fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'Abuzar@gmail.com', password: '235'} as User]);
    //     try{
    //        await service.signin('Abuzar@gmail.com', '12345@12345');
    //     }catch (err) {
    //        done();
    //     }
    // })

    it('should throws an error if invalid password provided', async (done) => {
        await service.signup('abuzarshabab@gmail.com', 'right_password') // signup with user credential

        try {
            await service.signin('abuzarshabab@gmail.com', 'wrong_password');  //  signin using bad credential
        } catch(err) {
            done();
        }
    })

    it('Should returns a user if correct password is provided', async() => {
        await service.signup('test@gmail.com', 'right_password');
        const user = await service.signin('test@gmail.com', 'right_password');
        expect(user).toBeDefined();
    })


})
