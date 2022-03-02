import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Divsecretariat} from '../entities/divsecretariat';

@Injectable({
  providedIn: 'root'
})
export class DivsecretariatService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Divsecretariat[]>{
    const divsecretariats = await this.http.get<Divsecretariat[]>(ApiManager.getURL('divsecretariats')).toPromise();
    return divsecretariats.map((divsecretariat) => Object.assign(new Divsecretariat(), divsecretariat));
  }

}
