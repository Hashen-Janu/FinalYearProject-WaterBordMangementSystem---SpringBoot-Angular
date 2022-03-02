import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Taskallocationstatus} from '../entities/taskallocationstatus';

@Injectable({
  providedIn: 'root'
})
export class TaskallocationstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Taskallocationstatus[]>{
    const taskallocationstatuses = await this.http.get<Taskallocationstatus[]>(ApiManager.getURL('taskallocationstatuses')).toPromise();
    return taskallocationstatuses.map((taskallocationstatus) => Object.assign(new Taskallocationstatus(), taskallocationstatus));
  }

}
