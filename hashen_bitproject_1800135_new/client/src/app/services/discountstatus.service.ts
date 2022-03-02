import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Discountstatus} from '../entities/discountstatus';

@Injectable({
  providedIn: 'root'
})
export class DiscountstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Discountstatus[]>{
    const discountstatuses = await this.http.get<Discountstatus[]>(ApiManager.getURL('discountstatuses')).toPromise();
    return discountstatuses.map((discountstatus) => Object.assign(new Discountstatus(), discountstatus));
  }

}
