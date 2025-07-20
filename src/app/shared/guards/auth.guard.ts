import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If not authenticated, redirect to login
    return inject(Router).createUrlTree(['/login']);
  }

  return true;
};
