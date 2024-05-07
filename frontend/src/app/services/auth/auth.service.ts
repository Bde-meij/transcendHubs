import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private loggedin = false;
	private authUrL = "/api/auth";
	private hostname: string;
	
	constructor(private http: HttpClient) {
		this.hostname = window.location.hostname;
	};

	register() : void {
		this.http.post(this.authUrL + '/register', { });
		console.log("authservice.register called");
	}

	login() : void {
		//window.location.href = `http://${this.hostname}:3000/api/auth/login`
		this.http.get(this.authUrL + '/login', { }).subscribe();
		console.log("authservice.login called");
		this.loggedin = true;
	};

	logout() : void {
		this.http.post(this.authUrL + '/logout', { });
		console.log("authservice.logout called");
		this.loggedin = false;
	}	
	
	getLogStatus() : boolean {
		return (this.loggedin);
	}
}
