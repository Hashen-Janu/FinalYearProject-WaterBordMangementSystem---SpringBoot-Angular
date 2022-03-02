import {Injectable} from '@angular/core';
import {Gender} from '../entities/gender';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Gender[]>{
    const genders = await this.http.get<Gender[]>(ApiManager.getURL('genders')).toPromise();
    return genders.map((gender) => Object.assign(new Gender(), gender));
  }

}
