import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Notification, NotificationDataPage} from '../entities/notification';
import {PageRequest} from '../shared/page-request';
import {User, UserDataPage} from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  async getUnreadCount(): Promise<number>{
    const object = await this.http.get<any>(ApiManager.getURL('notifications/unread/count')).toPromise();
    return object.count;
  }

  async getLatest(): Promise<Notification[]>{
    const notifications = await this.http.get<Notification[]>(ApiManager.getURL('notifications/latest')).toPromise();
    return notifications.map((notification) => Object.assign(new Notification(), notification));
  }

  async getAll(pageRequest: PageRequest): Promise<NotificationDataPage>{
    const url = pageRequest.getPageRequestURL('notifications');
    const notificationDataPage = await this.http.get<NotificationDataPage>(ApiManager.getURL(url)).toPromise();
    notificationDataPage.content = notificationDataPage.content.map((notification) => Object.assign(new Notification(), notification));
    return notificationDataPage;
  }

  async get(id: string): Promise<Notification>{
    const notification: Notification = await this.http.get<Notification>(ApiManager.getURL(`notifications/${id}`)).toPromise();
    return Object.assign(new Notification(), notification);
  }

  async setDelivered(id: string): Promise<void>{
    return this.http.put<void>(ApiManager.getURL('notifications/' + id + '/delivered'), {}).toPromise();
  }

  async setRead(id: string): Promise<void>{
    return this.http.put<void>(ApiManager.getURL('notifications/' + id + '/read'), {}).toPromise();
  }

}
