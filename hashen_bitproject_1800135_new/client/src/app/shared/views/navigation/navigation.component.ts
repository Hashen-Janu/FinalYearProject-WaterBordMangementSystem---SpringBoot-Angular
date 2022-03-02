import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {LinkItem} from '../../link-item';
import {LoggedUser} from '../../logged-user';
import {UserService} from '../../../services/user.service';
import {PrimeNumbers} from '../../prime-numbers';
import * as lodash from 'lodash';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy{

  private static readonly refreshRate = PrimeNumbers.getRandomNumber();
  isLive = false;

  treeControl = new NestedTreeControl<LinkItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<LinkItem>();
  @Input() linkItems: LinkItem[];
  @Input() heading: string;

  constructor(private userService: UserService) {}

  hasChild = (_: number, node: LinkItem) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.isLive = true;
    this.setNavigation();
  }

  setNavigation(): void{
    const li = lodash.cloneDeep(this.linkItems);
    const filteredItems = li.filter((linkItem) => this.getFilteredLinkedItems(linkItem) !== null);

    if (!lodash.isEqual(filteredItems, this.dataSource.data)){
      this.dataSource.data = filteredItems;
    }

    setTimeout(async () => {
      if (this.isLive){
        LoggedUser.usecases =  await this.userService.myUsecases();
        this.setNavigation();
      }
    }, NavigationComponent.refreshRate);
  }

  private getFilteredLinkedItems(linkItem: LinkItem): LinkItem{
    const uIds = linkItem.getUsecaseIds();
    if (!LoggedUser.canSome(uIds)){ return null; }
    if (LoggedUser.canAll(uIds)){ return linkItem; }

    const filteredChildren: LinkItem[] = [];
    for (const child of linkItem.children){
      if (this.getFilteredLinkedItems(child) !== null){
        filteredChildren.push(child);
      }
    }
    linkItem.children = filteredChildren;
    return linkItem;
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
