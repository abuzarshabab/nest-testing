import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    UseInterceptors
} from '@nestjs/common';
import { handleRetry } from '@nestjs/typeorm';

import { UsersService } from '../users.service';

// export function CurrentUserInterceptorDecorator() {
//     return UseInterceptors(new CurrentUserInterceptor(_));
// }

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept (context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();   
        const { userId } = request.session || {}; 

        if(!userId) return handler.handle();
        
        const user = await this.usersService.findOne(userId);
        request.currentUser = user;
        return handler.handle();
    }
}