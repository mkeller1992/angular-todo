import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './core/login/login.component';
import { AuthService } from './services/auth.service';
import { TodoService } from './services/todo.service';
import { BaseService } from './services/base.service';
import { AuthGuard } from './services/auth-guard.service';
import { RegistrationComponent } from './core/registration/registration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopNavbarComponent } from './core/top-navbar/top-navbar.component';
import { CalendarViewComponent } from './core/views/calendar-view/calendar-view.component';
import { LogoutComponent } from './core/logout/logout.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiSelectComponent } from './form-controls/multi-select/multi-select.component';
import { EditOverlayComponent } from './core/edit-overlay/edit-overlay.component';
import { AutocompleteComponent } from './form-controls/autocomplete/autocomplete.component';
import { MessagesComponent } from './form-controls/messages/messages.component';
import { MessageComponent } from './form-controls/messages/message/message.component';
import { DismissButtonComponent } from './form-controls/messages/dismiss-button/dismiss-button.component';
import { MessageService } from './services/message.service';
import { DialogComponent } from './form-controls/messages/dialog/dialog.component';
import { StandardFieldComponent } from './form-controls/standard-field/standard-field.component';
import { ListViewComponent } from './core/views/list-view/list-view.component';
import { HelpersService } from './services/helpers.service';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegistrationComponent,
		TopNavbarComponent,
		CalendarViewComponent,
		LogoutComponent,
		MultiSelectComponent,
		EditOverlayComponent,
		AutocompleteComponent,
		MessagesComponent,
		MessageComponent,
		DismissButtonComponent,
		DialogComponent,
		StandardFieldComponent,
		ListViewComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		NgbModule,
		NgMultiSelectDropDownModule.forRoot()
	],
	entryComponents: [
		EditOverlayComponent,
		DialogComponent
	],
	providers: [
		BaseService,
		AuthService,
		TodoService,
		AuthGuard,
		MessageService,
		HelpersService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
