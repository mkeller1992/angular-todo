import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { ApiError } from 'src/app/models/api-error.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	username: string; // = 'klm15';
	password: string; // = 'project4school';
	rememberMe: boolean;

	errorMsg: string;

	private _subs = new Subscription();

	constructor(private baseSvc: BaseService,
				private authSvc: AuthService,
				private router: Router) { }

	ngOnInit() {

		console.log('Initialize Login Component');

		// If user is already logged in, redirect to startpage:
		if (this.authSvc.isUserLoggedIn) {
			this.router.navigate(['/']);
		}

		// Set login-credentials if user ticked 'remember me'-checkbox
		const credentials = this.getRememberMe();
		if (credentials) {
			this.username = credentials.key;
			this.password = credentials.val;
			this.rememberMe = true;
		}
	}


	onLogin() {
		this.errorMsg = null;
		if (!this.username || !this.password) {
			this.errorMsg = 'Username or password missing!';
			return;
		}
		console.log('Trying to log in...');

		this._subs.add(this.authSvc.authenticateUser(this.username, this.password).subscribe(
			(user: User) => {
				console.log('User logged in successfully!', user);
				this.setRememberMe(this.rememberMe);
				this.router.navigate(['']);
			},
			(error: ApiError) => {
				if (error.status === 401) {
					this.errorMsg = 'Wrong Username or Password!';
				}
				else {
					this.errorMsg = 'An unknown error occured. Please try again!';
				}
			}
		));
	}

	onRegister() {
		this.router.navigate(['register']);
	}

	getRememberMe(): KeyValuePair<string, string> {
		const retrievedObject = localStorage.getItem(this.baseSvc.REMEMBER_ME_KEY);
		if (retrievedObject) {
			const credentials: KeyValuePair<string, string> = JSON.parse(retrievedObject);
			return credentials;
		}
	}

	setRememberMe(status: boolean) {
		if (status === true) {
			const credentials = new KeyValuePair<string, string>(this.username, this.password);
			localStorage.setItem(this.baseSvc.REMEMBER_ME_KEY, JSON.stringify(credentials));
		}
		else {
			localStorage.removeItem(this.baseSvc.REMEMBER_ME_KEY);
		}
	}

	ngOnDestroy(): void {
		this._subs.unsubscribe();
	}

}
