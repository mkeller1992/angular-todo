import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'app-top-navbar',
	templateUrl: './top-navbar.component.html',
	styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

	isNavbarCollapsed = true;

	get isUserLoggedIn(): boolean {
		return this.authSvc.isUserLoggedIn;
	}

	get user(): User {
		return this.authSvc.user;
	}

	get appName(): string {
		if (this.isUserLoggedIn) {
			return `Todos of ${this.user.username}`;
		}
		return 'Todo App';
	}

	constructor(private authSvc: AuthService) { }

	ngOnInit() {
	}

}
