import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-data-table',
  templateUrl: './empty-data-table.component.html',
  styleUrls: ['./empty-data-table.component.scss']
})
export class EmptyDataTableComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
