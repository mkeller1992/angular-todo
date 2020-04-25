import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})

export class BaseService {

	readonly BASE_URL = `${environment.webApiBaseUrl}`;
	readonly USER_STORAGE_KEY = 'TodoShmk_User';
	readonly REMEMBER_ME_KEY = 'TodoShmk_Credentials';

	private _user: User;

	get user(): User {
		if (!this._user) {
			const retrievedObject = localStorage.getItem(this.USER_STORAGE_KEY);
			console.log('User in local storage: ', retrievedObject);
			if (retrievedObject) {
				this._user = JSON.parse(retrievedObject);
			}
		}
		return this._user;
	}

	set user(value: User) {
		this._user = value;
	}


	get optionsContentTypeJson() {
		if (this.user) {
			return { headers: {
				Authorization: `Bearer ${this._user.token}`,
				'Content-Type': 'application/json'
			}};
		}
		return null;
	}


	constructor(private router: Router) { }


	public handleError(error: ApiError): Observable<ApiError> {
		if (error.status === 401) {
			this.router.navigate(['logout']);
		}
		const errMsg =  error.message || 'Server error';
		console.error(errMsg);
		return throwError(error);
	}
}
