import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import exp from 'constants';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService> ;
  let fakeAuthService: Partial<AuthService> ;
  
  
  beforeEach(async () => {
    const users: User[] = [];
    
    fakeUsersService = { 
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
        users.push(user);
        return Promise.resolve(user)
      },
      findOne: (id: number) => {
        // const user = users.find((user) => user.id === id);
        return Promise.resolve({ id, email: 'abuzarshabab@gmail.com', password: 'correct passwrod' } as User);
      }, 

      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
        const fileterdUser = users.filter( user => user.email === email);
        return Promise.resolve(fileterdUser);
        
      },

      update: (id, attrs) => {
        const user = users.find((user)=> user.id === id);
        user.email = attrs?.email;
        user.password = attrs?.password

        users.push(user);
        return Promise.resolve(user);
      },
      remove: (id: number) => {
        const user = users.find((user, index) => {
          if(user.id === id)
            users.splice(index);
          return(user)
        });
        return Promise.resolve(user);
      },
    };
    fakeAuthService = {
      signin: (email, password) => {
        return Promise.resolve({email, password, id: 1} as User)
      },
      // signup: (email, password) => {
      //   return Promise.resolve({email, password, id: 12} as User)
      // }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }, 
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return user', async () => {
    const email = 'test@test.com';

    const user = await controller.findAllUsers(email);
    expect(user.length).toBeGreaterThan(0);
    expect(user[0].email).toEqual(email);
  }) 

  // it('Should return a user with the given id', async() => {
  //   const user = { email: 'test@test.com', password: 'right password' };
  //   const createdUser = await controller.createUser(user);
  //   console.log(user);
  //   expect(user);
  // } )

    it('Should return a user with the given id', async() => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    });
    
    it('should throw an error given id does not match', async (done) => {
      fakeUsersService.findOne = () => null;
      try{
        const user = await controller.findUser('1');
      } catch(err) {
        done();
      }
    })

    it('Should updates session object and returns user', async() => {
      let session = { userId: -1 };
      const user = { email: 'test@test.com', password: 'right password' };
      const loggedUser = await controller.signin(user, session);

      expect(loggedUser.id).toBe(1);
      expect(session.userId).toBe(1);
    })
});
