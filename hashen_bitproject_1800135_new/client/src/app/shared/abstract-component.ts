import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrimeNumbers} from './prime-numbers';
import {ApiManager} from './api-manager';
import {User} from '../entities/user';

@Component({
  template: ''
})
export abstract class AbstractComponent implements OnInit, OnDestroy{

  public loaded = false;
  protected isLive = true;
  protected refreshRate  = PrimeNumbers.getRandomNumber();
  public privilege = {
    showOne: false,
    showAll: false,
    add: false,
    delete: false,
    update: false
  };

  get thumbnailURL(): string{
    return ApiManager.getURL('files/thumbnail/');
  }

  protected initialLoaded(): void{
    this.loaded = true;
  }

  getUserDisplayName(user: User): string{
    return User.getDisplayName(user);
  }

  ngOnDestroy(): void{
    this.isLive = false;
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }



  abstract ngOnInit(): any;
  abstract updatePrivileges(): any;
  abstract async loadData(): Promise<any>;

  protected constructor() {}

}
