import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Gramaniladharidiv} from '../entities/gramaniladharidiv';

@Injectable({
  providedIn: 'root'
})
export class GramaniladharidivService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Gramaniladharidiv[]>{
    const gramaniladharidivs = await this.http.get<Gramaniladharidiv[]>(ApiManager.getURL('gramaniladharidivs')).toPromise();
    return gramaniladharidivs.map((gramaniladharidiv) => Object.assign(new Gramaniladharidiv(), gramaniladharidiv));
  }

}
