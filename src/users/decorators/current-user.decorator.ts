import { createParamDecorator, ExecutionContext} from '@nestjs/common'
import { stringify } from 'querystring';

export const CurrentUser = createParamDecorator(

    (date: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const next = context.switchToHttp().getNext();

        console.log('Request', request.session.userId )
        return request.currentUser;
    }   
)

// Execution context  === request ( That can be used on different thing
