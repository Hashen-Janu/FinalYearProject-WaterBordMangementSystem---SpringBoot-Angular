import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Discounttype} from '../entities/discounttype';

@Injectable({
  providedIn: 'root'
})
export class DiscounttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Discounttype[]>{
    const discounttypes = await this.http.get<Discounttype[]>(ApiManager.getURL('discounttypes')).toPromise();
    return discounttypes.map((discounttype) => Object.assign(new Discounttype(), discounttype));
  }

}
