import {ClientToken} from '../client-token';

export class TokenManager {
  static setToken(clientToken: ClientToken): void{
    localStorage.setItem('clientToken', JSON.stringify(clientToken));
  }

  static getToken(): ClientToken{
    const tokenText = localStorage.getItem('clientToken');
    if (tokenText === null) { return null; }

    return JSON.parse(tokenText) as ClientToken;
  }

  static destroyToken(): void{
    localStorage.removeItem('clientToken');
  }

  static isContainsToken(): boolean{
    return this.getToken() !== null;
  }
}
