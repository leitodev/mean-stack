import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse ) => {
      console.log('interceptor: ', error.error.message);
      if (error.error.message) {
        alert(error.error.message);
      }
      return throwError(() => error);
    })
  );
};
