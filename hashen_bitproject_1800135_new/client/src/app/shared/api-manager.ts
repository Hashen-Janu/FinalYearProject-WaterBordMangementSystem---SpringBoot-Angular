export class ApiManager {

  static readonly BASE_URL = 'http://localhost:8080/';

  static getURL(url: string): string{
    return this.BASE_URL + url;
  }

}
