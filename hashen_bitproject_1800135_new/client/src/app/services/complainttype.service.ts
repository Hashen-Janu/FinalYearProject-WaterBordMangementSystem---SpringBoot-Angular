import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Complainttype} from '../entities/complainttype';

@Injectable({
  providedIn: 'root'
})
export class ComplainttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Complainttype[]>{
    const complainttypes = await this.http.get<Complainttype[]>(ApiManager.getURL('complainttypes')).toPromise();
    return complainttypes.map((complainttype) => Object.assign(new Complainttype(), complainttype));
  }

}
