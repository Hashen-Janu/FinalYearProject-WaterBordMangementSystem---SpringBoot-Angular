import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Designation} from '../entities/designation';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Designation[]>{
    const designations = await this.http.get<Designation[]>(ApiManager.getURL('designations')).toPromise();
    return designations.map((designation) => Object.assign(new Designation(), designation));
  }

}
