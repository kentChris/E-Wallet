import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException, Catch, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import ApiError from './api-error';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        status: 'success',
        data,
      })),
      catchError(error => {
        console.log(error);
        const response = error.getResponse();
        const status = error.getStatus();
  
        let responseData: any;
        if (typeof response === 'string') {
          responseData = { status: 'fail', data: {error: response} };
        } else if (typeof response === 'object' && response.message) {
          responseData = { status: 'fail', data: {error: response.message} };
        } else {
          responseData = { status: 'fail', data: 'Internal Server Error' };
        }
  
        return throwError(new HttpException(responseData, status || HttpStatus.INTERNAL_SERVER_ERROR));
      }),
    );
  }
}
