import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {ToastrService} from "ngx-toastr";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse ) => {
      if (error.error.message) {
        toastr.error(error.error.message);
      }
      return throwError(() => error);
    })
  );
};
