import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Vehicletype} from '../entities/vehicletype';

@Injectable({
  providedIn: 'root'
})
export class VehicletypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Vehicletype[]>{
    const vehicletypes = await this.http.get<Vehicletype[]>(ApiManager.getURL('vehicletypes')).toPromise();
    return vehicletypes.map((vehicletype) => Object.assign(new Vehicletype(), vehicletype));
  }

}
