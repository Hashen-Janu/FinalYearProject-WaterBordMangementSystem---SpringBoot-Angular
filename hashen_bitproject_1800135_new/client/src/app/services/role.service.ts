import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {ApiManager} from '../shared/api-manager';
import {Role, RoleDataPage} from '../entities/role';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<RoleDataPage>{
    const url = pageRequest.getPageRequestURL('roles');
    const roleDataPage = await this.http.get<RoleDataPage>(ApiManager.getURL(url)).toPromise();
    roleDataPage.content = roleDataPage.content.map((role) => Object.assign(new Role(), role));
    return roleDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<RoleDataPage>{
    const url = pageRequest.getPageRequestURL('roles/basic');
    const roleDataPage = await this.http.get<RoleDataPage>(ApiManager.getURL(url)).toPromise();
    roleDataPage.content = roleDataPage.content.map((role) => Object.assign(new Role(), role));
    return roleDataPage;
  }

  async get(id: number): Promise<Role>{
    const role: Role = await this.http.get<Role>(ApiManager.getURL(`roles/${id}`)).toPromise();
    return Object.assign(new Role(), role);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`roles/${id}`)).toPromise();
  }

  async add(role: Role): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`roles`), role).toPromise();
  }

  async update(id: number, role: Role): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`roles/${id}`), role).toPromise();
  }

}
