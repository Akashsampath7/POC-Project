import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRole(): string {
    throw new Error('Method not implemented.');
  }
  getAdminName: any;

  constructor() { }
}
