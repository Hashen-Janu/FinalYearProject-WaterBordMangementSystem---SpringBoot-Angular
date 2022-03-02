import {User} from '../entities/user';
import {Usecase} from '../entities/usecase';
import {ApiManager} from './api-manager';

export class LoggedUser {

  public static user: User = null;
  public static usecases: Usecase[] = [];

  public static can(usecaseId: number): boolean{
    if (usecaseId === null) { return true; }
    return this.usecases.find(usecase => usecase.id === usecaseId ) !== undefined;
  }

  public static canSome(usecaseIds: number[]): boolean{
    if (usecaseIds.length === 0) { return true; }
    let can = false;
    for (const id of usecaseIds){
      if (this.can(id)){
        can = true;
        break;
      }
    }
    return can;
  }

  public static canAll(usecaseIds: number[]): boolean{
    let can = true;
    for (const id of usecaseIds){
      if (!this.can(id)){
        can = false;
        break;
      }
    }
    return can;
  }

  public static clear(): void{
    this.usecases = [];
    this.user = null;
  }

  public static getPhoto(): string{
    if (!this.user){ return null; }
    if (this.user.photo) { return ApiManager.getURL('files/thumbnail/' + this.user.photo); }
    return 'assets/user.jpg';
  }

  public static getName(): string{
    if (!this.user){ return null; }
    return User.getDisplayName(this.user);
  }

}
