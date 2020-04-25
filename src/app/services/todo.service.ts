import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error.model';
import { Todo } from '../models/todo.model';


@Injectable({
	providedIn: 'root'
})

export class TodoService {

	public allTodos: Todo[];
	public allCategories: string[];
	public selectedCategories: string[];

	constructor(private baseSvc: BaseService,
				private http: HttpClient) { }


	public getAllTodos(): Observable<Todo[] | ApiError> {
		const url = `${this.baseSvc.BASE_URL}todos`;
		console.log('TodoService.getAllTodos - calling: ', url);
		return this.http.get(url, this.baseSvc.optionsContentTypeJson)
		.pipe(
			map((data: Todo[]) => {
				console.log('TodoService.getTodos: ', data);
				data.sort((a, b) => b.id - a.id);
				return data;
			}),
			catchError((error: ApiError) => {
				console.error('Fetching Todos failed!');
				return this.baseSvc.handleError(error);
			})
		);
	}

	public getTodoById(todoId: number): Observable<Todo | ApiError> {
		const url = `${this.baseSvc.BASE_URL}todos/${todoId}`;
		console.log('TodoService.getTodoById - calling: ', url);
		return this.http.get(url, this.baseSvc.optionsContentTypeJson)
		.pipe(
			map((data: Todo) => {
				console.log('TodoService.getTodoById: ', data);
				return data;
			}),
			catchError((error: ApiError) => {
				return this.baseSvc.handleError(error);
			})
		);
	}

	public getAllCategories(): Observable<string[] | ApiError> {
		const url = `${this.baseSvc.BASE_URL}categories`;
		console.log('TodoService.getAllCategories - calling: ', url);
		return this.http.get(url, this.baseSvc.optionsContentTypeJson)
		.pipe(
			map((data: string[]) => {
				console.log('TodoService.getAllCategories: ', data);
				data.sort();
				return data;
			}),
			catchError((error: ApiError) => {
				console.error('Fetching categories failed!');
				return this.baseSvc.handleError(error);
			})
		);
	}

	public createTodo(newTodo: Todo): Observable<Todo | ApiError> {
		const url = `${this.baseSvc.BASE_URL}todos`;
		console.log('TodoService.createTodo - calling: ', url);
		console.log('Trying to save: ', newTodo);
		return this.http.post(url, newTodo, this.baseSvc.optionsContentTypeJson)
		.pipe(
			map((data: Todo) => {
				console.log('TodoService.createTodo: ', data);
				return data;
			}),
			catchError((error: ApiError) => {
				console.error('Creating Todo failed!');
				return this.baseSvc.handleError(error);
			})
		);
	}

	public updateTodo(todo: Todo): Observable<Todo | ApiError> {
		const url = `${this.baseSvc.BASE_URL}todos/${todo.id}`;
		console.log('TodoService.updateTodo - calling: ', url);
		return this.http.put(url, todo, this.baseSvc.optionsContentTypeJson)
		.pipe(
			map((data: Todo) => {
				console.log('TodoService.updateTodo: ', data);
				return data;
			}),
			catchError((error: ApiError) => {
				console.error('Updating Todo failed!');
				return this.baseSvc.handleError(error);
			})
		);
	}

	public deleteTodo(todoId: number): Observable<string | ApiError> {
		const url = `${this.baseSvc.BASE_URL}todos/${todoId}`;
		console.log('TodoService.deleteTodo - calling: ', url);
		return this.http.delete(url, { headers: { Authorization: `Bearer ${this.baseSvc.user.token}` }, responseType: 'text' })
		.pipe(
			map((data: string) => {
				console.log('TodoService.deleteTodo: ', data);
				return data;
			}),
			catchError((error: ApiError) => {
				console.error('Deleting Todo failed!');
				return this.baseSvc.handleError(error);
			})
		);
	}

}

