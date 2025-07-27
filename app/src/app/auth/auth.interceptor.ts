import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = inject(AuthService).getToken();
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.set('authorization', 'Bearer '+authToken),
  });

  return next(newReq);
};
