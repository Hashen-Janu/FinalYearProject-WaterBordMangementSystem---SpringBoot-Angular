import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Complaintstatus} from '../entities/complaintstatus';

@Injectable({
  providedIn: 'root'
})
export class ComplaintstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Complaintstatus[]>{
    const complaintstatuses = await this.http.get<Complaintstatus[]>(ApiManager.getURL('complaintstatuses')).toPromise();
    return complaintstatuses.map((complaintstatus) => Object.assign(new Complaintstatus(), complaintstatus));
  }

}
