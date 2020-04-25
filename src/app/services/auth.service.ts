import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error.model';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	get user(): User {
		return this.baseSvc.user;
	}

	get isUserLoggedIn(): boolean {
		if (this.baseSvc.user) {
			return true;
		}
		return false;
	}

	constructor(private http: HttpClient,
				private baseSvc: BaseService) { }


	public authenticateUser(user: string, pass: string): Observable<User | ApiError> {

		const url = `${this.baseSvc.BASE_URL}users/login`;
		console.log('Calling: ', url);

		return this.http.post(url, null, { headers: { Authorization: 'Basic ' + btoa(user + ':' + pass) }, responseType: 'text' })
		.pipe(
			map((token: string) => {
				this.baseSvc.user = new User(user, token);
				this.saveToLocalStorage(this.baseSvc.user);

				console.log('AuthService.authenticateUser() - Logged in User: ', this.baseSvc.user);
				return this.baseSvc.user;
			})
		);
	}

	registerNewUser(user: string, pass: string) {
		const url = `${this.baseSvc.BASE_URL}users`;
		console.log('Calling: ', url);

		const credentials = { name: user, password: pass };

		return this.http.post(url, credentials, { headers: { }, responseType: 'text' })
		.pipe(
			map((token: string) => {
				this.baseSvc.user = new User(user, token);
				this.saveToLocalStorage(this.baseSvc.user);

				console.log('AuthService.authenticateUser() - Logged in User: ', this.baseSvc.user);
				return this.baseSvc.user;
			}),
			catchError((error: ApiError) => {
				return this.baseSvc.handleError(error);
			})
		);
	}


	public removeUser() {
		this.baseSvc.user = null;
		localStorage.removeItem(this.baseSvc.USER_STORAGE_KEY);
	}

	private saveToLocalStorage(user: User) {
		localStorage.setItem(this.baseSvc.USER_STORAGE_KEY, JSON.stringify(user));
	}


}
