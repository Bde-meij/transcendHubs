import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, map, of } from 'rxjs';


export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const forbidden = nameRe.test(control.value);
		return forbidden ? {forbiddenName: {value: control.value}} : null;
	};
}

@Injectable({
	providedIn: 'root'
})
export class UniqueNameValidator implements AsyncValidator {
	constructor(private authService: AuthService) {}

	validate(control: AbstractControl): Observable<ValidationErrors | null> {
		return this.authService.isNameTaken(control.value).pipe(
			map((isTaken) => (isTaken ? {uniqueName: true} : null)),
			catchError(() => of(null)),
		);
	}
}