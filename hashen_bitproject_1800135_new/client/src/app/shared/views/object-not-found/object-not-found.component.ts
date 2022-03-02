import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-object-not-found',
  templateUrl: './object-not-found.component.html',
  styleUrls: ['./object-not-found.component.scss']
})
export class ObjectNotFoundComponent implements OnInit {

  @Input() message: string;

  constructor(private loc: Location) { }

  ngOnInit(): void {
  }

  goBack(): void{
    this.loc.back();
  }

}
