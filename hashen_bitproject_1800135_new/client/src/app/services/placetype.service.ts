import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Placetype} from '../entities/placetype';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class PlacetypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Placetype[]>{
    const placetypes = await this.http.get<Placetype[]>(ApiManager.getURL('placetypes')).toPromise();
    return placetypes.map((placetype) => Object.assign(new Placetype(), placetype));
  }

}
