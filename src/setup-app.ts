
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
    app.use(cookieSession({
        keys: ['abuzar'],
      }));
    
      (app as any).set('etag', false);
      app.use((req, res, next) => {
        res.removeHeader('x-powered-by');
        res.removeHeader('date');
        next();
      });
      
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        }),
      );
}