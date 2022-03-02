import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Consumertype} from '../entities/consumertype';

@Injectable({
  providedIn: 'root'
})
export class ConsumertypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Consumertype[]>{
    const consumertypes = await this.http.get<Consumertype[]>(ApiManager.getURL('consumertypes')).toPromise();
    return consumertypes.map((consumertype) => Object.assign(new Consumertype(), consumertype));
  }

}
