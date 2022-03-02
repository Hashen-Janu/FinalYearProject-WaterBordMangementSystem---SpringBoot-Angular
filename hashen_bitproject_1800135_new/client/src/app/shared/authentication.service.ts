import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from './login-request';
import {ClientToken} from './client-token';
import {ApiManager} from './api-manager';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }


  async getToken(loginRequest: LoginRequest): Promise<ClientToken>{
    const clientToken: ClientToken = await this.http.post<ClientToken>(ApiManager.getURL('authentication'), loginRequest).toPromise();
    return Object.assign(new ClientToken(), clientToken);
  }

  async destroyToken(): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL('authentication')).toPromise();
  }


}
