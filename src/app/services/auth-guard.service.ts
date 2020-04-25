import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	constructor(private router: Router,
				private userSvc: AuthService) { }


	canActivate(route: ActivatedRouteSnapshot,
				state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		console.log('Route Data: ', state.url);

		// If user is NOT logged in, redirect to login page while preserving the target-url

		if (!this.userSvc.user) {
			this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
		console.log('User is logged in');
		return true;
	}


	canActivateChild(route: ActivatedRouteSnapshot,
					state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		return this.canActivate(route, state);
	}

}