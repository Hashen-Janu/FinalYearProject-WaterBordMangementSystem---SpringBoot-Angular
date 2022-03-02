import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Usecase} from '../entities/usecase';
import {ResourceLink} from '../shared/resource-link';
import {PageRequest} from '../shared/page-request';
import {User, UserDataPage} from '../entities/user';
import {Employee} from '../entities/employee';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  async me(): Promise<User>{
    const user = await this.http.get<User>(ApiManager.getURL('users/me')).toPromise();
    return Object.assign(new User(), user);
  }

  async myUsecases(): Promise<Usecase[]>{
    return this.http.get<Usecase[]>(ApiManager.getURL('users/me/usecases')).toPromise();
  }

  async changeMyPassword(data: object): Promise<void>{
    return this.http.put<void>(ApiManager.getURL('users/me/password'), data).toPromise();
  }

  async changeMyPhoto(photo: string): Promise<void>{
    return this.http.put<void>(ApiManager.getURL('users/me/photo'), {photo}).toPromise();
  }

  async resetPassword(id: number, password: string): Promise<void>{
    return this.http.put<void>(ApiManager.getURL('users/' + id + '/password'), {password}).toPromise();
  }

  async getAll(pageRequest: PageRequest): Promise<UserDataPage>{
    const url = pageRequest.getPageRequestURL('users');
    const userDataPage = await this.http.get<UserDataPage>(ApiManager.getURL(url)).toPromise();
    userDataPage.content = userDataPage.content.map((user) => Object.assign(new User(), user));
    return userDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<UserDataPage>{
    const url = pageRequest.getPageRequestURL('users/basic');
    const userDataPage = await this.http.get<UserDataPage>(ApiManager.getURL(url)).toPromise();
    userDataPage.content = userDataPage.content.map((user) => Object.assign(new User(), user));
    return userDataPage;
  }

  async get(id: number): Promise<User>{
    const user: User = await this.http.get<User>(ApiManager.getURL(`users/${id}`)).toPromise();
    return Object.assign(new User(), user);
  }

  async add(user: User): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`users`), user).toPromise();
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`users/${id}`)).toPromise();
  }

  async update(id: number, user: User): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`users/${id}`), user).toPromise();
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`users/${id}/photo`)).toPromise();
  }

  async getAllUserEmployees(): Promise<Employee[]>{
    const employees = await this.http.get<Employee[]>(ApiManager.getURL('users/employees')).toPromise();
    return  employees.map((employee) => Object.assign(new Employee(), employee));
  }

  async getAllNonUserEmployees(): Promise<Employee[]>{
    const employees = await this.http.get<Employee[]>(ApiManager.getURL('users/nonuser/employees')).toPromise();
    return  employees.map((employee) => Object.assign(new Employee(), employee));
  }

}