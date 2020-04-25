import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
	selector: 'app-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {



	constructor(private todoService: TodoService,
				private authService: AuthService,
				private router: Router) { }


	ngOnInit() {
		// this.initializeData();
	}







}
