import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
	providedIn: 'root'
})

export class HelpersService {

	public getWeekDay(date: Date) {
		// Create an array containing each day, starting with Sunday.
		const weekdays = new Array(
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
		// Use the getDay() method to get the day.
		const day = date.getDay();
		// Return the element that corresponds to that index.
		return weekdays[day];
	}

	public getDatesOfSelectedWeek(selectedDate: Date): Date[] {
		const firstDayOfWeek = this.getMonday(selectedDate);
		const datesOfW: Date[] = [ firstDayOfWeek ];
		for (let i = 1; i < 7; i++) {
			const d = this.addDaysToDate(firstDayOfWeek, i);
			datesOfW.push(d);
		}
		return datesOfW;
	}

	public getMonday(selectedDate: Date): Date {
		const d = new Date(selectedDate);
		const day = d.getDay();
		const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	}

	public addDaysToDate(currentDate: Date, daysToAdd: number): Date {
		const date = new Date(currentDate);
		date.setDate(date.getDate() + daysToAdd);
		return date;
	}

	/* CH-String: dd.mm.yy */
	public getDateAsCHString(d: Date): string {
		if (!d) { return null; }
		return `${('0' + d.getDate()).slice(-2)}.${('0' + (d.getMonth() + 1)).slice(-2)}.${`${d.getFullYear()}`.substring(2)}`;
	}

	/* US-String: yyyy-mm-dd */
	public getDateAsUSString(d: Date): string {
		if (!d) { return null; }
		return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
	}

	public getDateFromUSString(usString: /* yyyy-mm-dd */ string): Date {
		if (!usString) { return null; }
		const d = usString.split('-');
		return new Date(+d[0], +d[1] - 1, +d[2], 0, 0, 0, 0);
	}

	public getNgbDateStructFromUSDateStr(dateStrUS: string): NgbDateStruct {
		if (!dateStrUS) { return null; }
		const d = dateStrUS.split('-');
		return { year: +d[0], month: +d[1], day: +d[2] } as NgbDateStruct;
	}


}
