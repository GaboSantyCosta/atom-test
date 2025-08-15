import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const auth: Auth = inject(Auth);
  const authState$ = authState(auth);

  return authState$.pipe(
    take(1),
    map(user => !!user),
    tap(loggedIn => {
      if (!loggedIn) {
        return router.navigateByUrl(`login`);
      }
      return true;
    })
  )
};
