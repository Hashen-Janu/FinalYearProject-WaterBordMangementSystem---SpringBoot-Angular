import {Injectable} from '@angular/core';
import {Tasktype} from '../entities/tasktype';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class TasktypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Tasktype[]>{
    const tasktypes = await this.http.get<Tasktype[]>(ApiManager.getURL('tasktypes')).toPromise();
    return tasktypes.map((tasktype) => Object.assign(new Tasktype(), tasktype));
  }

}
