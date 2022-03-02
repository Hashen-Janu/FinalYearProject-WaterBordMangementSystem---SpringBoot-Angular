import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Ownershiptype} from '../entities/ownershiptype';

@Injectable({
  providedIn: 'root'
})
export class OwnershiptypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Ownershiptype[]>{
    const ownershiptypes = await this.http.get<Ownershiptype[]>(ApiManager.getURL('ownershiptypes')).toPromise();
    return ownershiptypes.map((ownershiptype) => Object.assign(new Ownershiptype(), ownershiptype));
  }

}
