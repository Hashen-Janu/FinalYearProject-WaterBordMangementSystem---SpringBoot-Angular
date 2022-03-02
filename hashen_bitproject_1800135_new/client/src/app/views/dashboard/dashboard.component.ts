import {Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clock = '';
  clockHandle;

  constructor() {

  }

  ngOnInit(): void {
    this.clockHandle = setInterval(() => {
      this.clock = new Date().getHours().toLocaleString() + ' : ' + new Date().getMinutes().toLocaleString() + ' : ' + new Date().getSeconds().toLocaleString();
    }, 1000);
  }
}
