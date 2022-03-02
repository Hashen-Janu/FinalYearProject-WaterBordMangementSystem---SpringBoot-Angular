import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-no-privilege',
  templateUrl: './no-privilege.component.html',
  styleUrls: ['./no-privilege.component.scss']
})
export class NoPrivilegeComponent implements OnInit {

  @Input() message: string;

  constructor(private loc: Location) { }

  ngOnInit(): void {
  }

  goBack(): void{
    this.loc.back();
  }

}
