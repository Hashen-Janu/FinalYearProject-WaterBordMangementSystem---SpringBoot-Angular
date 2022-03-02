import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Employee, EmployeeDataPage} from '../entities/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<EmployeeDataPage>{
    const url = pageRequest.getPageRequestURL('employees');
    const employeeDataPage = await this.http.get<EmployeeDataPage>(ApiManager.getURL(url)).toPromise();
    employeeDataPage.content = employeeDataPage.content.map((employee) => Object.assign(new Employee(), employee));
    return employeeDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<EmployeeDataPage>{
    const url = pageRequest.getPageRequestURL('employees/basic');
    const employeeDataPage = await this.http.get<EmployeeDataPage>(ApiManager.getURL(url)).toPromise();
    employeeDataPage.content = employeeDataPage.content.map((employee) => Object.assign(new Employee(), employee));
    return employeeDataPage;
  }

  async get(id: number): Promise<Employee>{
    const employee: Employee = await this.http.get<Employee>(ApiManager.getURL(`employees/${id}`)).toPromise();
    return Object.assign(new Employee(), employee);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`employees/${id}`)).toPromise();
  }

  async add(employee: Employee): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`employees`), employee).toPromise();
  }

  async update(id: number, employee: Employee): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`employees/${id}`), employee).toPromise();
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`employees/${id}/photo`)).toPromise();
  }


  async getAllByUnit(id: number): Promise<Employee[]>{
    let employeeDataPage = await this.http.get<Employee[]>(ApiManager.getURL(`employees/byunitforallocation/${id}`)).toPromise();
    employeeDataPage = employeeDataPage.map((employee) => Object.assign(new Employee(), employee));
    return employeeDataPage;
  }


}
