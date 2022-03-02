import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Connection, ConnectionDataPage} from '../entities/connection';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConnectionDataPage>{
    const url = pageRequest.getPageRequestURL('connections');
    const connectionDataPage = await this.http.get<ConnectionDataPage>(ApiManager.getURL(url)).toPromise();
    connectionDataPage.content = connectionDataPage.content.map((connection) => Object.assign(new Connection(), connection));
    return connectionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConnectionDataPage>{
    const url = pageRequest.getPageRequestURL('connections/basic');
    const connectionDataPage = await this.http.get<ConnectionDataPage>(ApiManager.getURL(url)).toPromise();
    connectionDataPage.content = connectionDataPage.content.map((connection) => Object.assign(new Connection(), connection));
    return connectionDataPage;
  }

  async get(id: number): Promise<Connection>{
    const connection: Connection = await this.http.get<Connection>(ApiManager.getURL(`connections/${id}`)).toPromise();
    return Object.assign(new Connection(), connection);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`connections/${id}`)).toPromise();
  }

  async add(connection: Connection): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`connections`), connection).toPromise();
  }

  async update(id: number, connection: Connection): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`connections/${id}`), connection).toPromise();
  }

  async getAllByConsumer(id: number): Promise<Connection[]>{
    let connections = await this.http.get<Connection[]>(ApiManager.getURL(`connections/byconsumer/${id}`)).toPromise();
    connections = connections.map((connection) => Object.assign(new Connection(), connection));
    return connections;
  }


}
