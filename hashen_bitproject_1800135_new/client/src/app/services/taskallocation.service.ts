import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Taskallocation, TaskallocationDataPage} from '../entities/taskallocation';

@Injectable({
  providedIn: 'root'
})
export class TaskallocationService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<TaskallocationDataPage>{
    const url = pageRequest.getPageRequestURL('taskallocations');
    const taskallocationDataPage = await this.http.get<TaskallocationDataPage>(ApiManager.getURL(url)).toPromise();
    taskallocationDataPage.content = taskallocationDataPage.content.map((taskallocation) => Object.assign(new Taskallocation(), taskallocation));
    return taskallocationDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<TaskallocationDataPage>{
    const url = pageRequest.getPageRequestURL('taskallocations/basic');
    const taskallocationDataPage = await this.http.get<TaskallocationDataPage>(ApiManager.getURL(url)).toPromise();
    taskallocationDataPage.content = taskallocationDataPage.content.map((taskallocation) => Object.assign(new Taskallocation(), taskallocation));
    return taskallocationDataPage;
  }

  async get(id: number): Promise<Taskallocation>{
    const taskallocation: Taskallocation = await this.http.get<Taskallocation>(ApiManager.getURL(`taskallocations/${id}`)).toPromise();
    return Object.assign(new Taskallocation(), taskallocation);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`taskallocations/${id}`)).toPromise();
  }

  async add(taskallocation: Taskallocation): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`taskallocations`), taskallocation).toPromise();
  }

  async update(id: number, taskallocation: Taskallocation): Promise<ResourceLink> {
    return this.http.put<ResourceLink>(ApiManager.getURL(`taskallocations/${id}`), taskallocation).toPromise();
  }


  async done(id: number): Promise<void>{
    return this.http.get<void>(ApiManager.getURL(`taskallocations/done/${id}`)).toPromise();
  }

}
