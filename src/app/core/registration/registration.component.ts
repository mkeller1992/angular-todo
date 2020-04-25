import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ApiError } from 'src/app/models/api-error.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

	username: string;
	password: string;
	repeatedPassword: string;

	registrationSuccessful = false;

	errorMsg: string;
	successMsg = 'Registrierung erfolgreich!';


	constructor(private authService: AuthService,
				private router: Router) { }

	ngOnInit() { }


	onRegister() {
		this.errorMsg = null;
		const err = this.validate();
		if (err === '') {
			this.authService.registerNewUser(this.username, this.password).subscribe(
				(data: User) => {
					this.registrationSuccessful = true;
				},
				(error: ApiError) => {
					if (error.status === 409) {
						this.errorMsg = 'User with the same name already exists!';
						this.resetFields();
					}
				}
			);
		}
		else {
			this.errorMsg = err;
		}
	}

	onLogin() {
		this.router.navigate(['login']);
	}

	private validate(): string {
		if (!this.username || !this.password || !this.repeatedPassword) {
			return 'You must fill out all fields!';
		}
		if (this.password !== this.repeatedPassword) {
			return 'Passwords do not match, please try again';
		}
		return '';
	}

	private resetFields() {
		this.username = null;
		this.password = null;
		this.repeatedPassword = null;
	}


}
