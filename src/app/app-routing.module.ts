import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { RegistrationComponent } from './core/registration/registration.component';
import { CalendarViewComponent } from './core/views/calendar-view/calendar-view.component';
import { LogoutComponent } from './core/logout/logout.component';
import { ListViewComponent } from './core/views/list-view/list-view.component';


const routes: Routes = [
	{
		path: 'register',
		component: RegistrationComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'todo-list',
		canActivate: [AuthGuard],
		component: ListViewComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
	},
	{
		path: '',
		canActivate: [AuthGuard],
		pathMatch: 'full',
		component: CalendarViewComponent
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
