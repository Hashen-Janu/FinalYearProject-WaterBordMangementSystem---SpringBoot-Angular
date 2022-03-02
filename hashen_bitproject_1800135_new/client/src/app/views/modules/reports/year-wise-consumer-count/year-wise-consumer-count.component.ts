 import { Component, OnInit } from '@angular/core';
 import {ReportService} from '../../../../services/report.service';
 import {AbstractComponent} from '../../../../shared/abstract-component';
 import {ReportHelper} from '../../../../shared/report-helper';
 import {Color, Label} from 'ng2-charts';
 import { ChartDataSets } from 'chart.js';
 import {ThemeManager} from '../../../../shared/views/theme-manager';

 @Component({
  selector: 'app-year-wise-consumer-count',
  templateUrl: './year-wise-consumer-count.component.html',
  styleUrls: ['./year-wise-consumer-count.component.scss']
})
 export class YearWiseConsumerCountComponent extends AbstractComponent implements OnInit {

   yearWiseData: any[];

   get isDark(): boolean{
     return ThemeManager.isDark();
   }

   public lineChartData: ChartDataSets[] = [
     { data: [], label: 'Count' },
   ];
   public lineChartLabels: Label[] = [];
   public lineChartOptions = {
     responsive: true,
     maintainAspectRatio: false,
     scales: {
       xAxes: [{
         ticks: { fontColor: this.isDark ? 'white' : 'black' },
         gridLines: { color: this.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
       }],
       yAxes: [{
         ticks: { fontColor: this.isDark ? 'white' : 'black' },
         gridLines: { color: this.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
       }]
     }
   };
   public lineChartColors: Color[] = [
     {
       borderColor: 'rgba(0,0,255,0.5)',
       backgroundColor: 'rgba(0,0,255,0.3)',
     },
   ];
   public lineChartLegend = false;
   public lineChartType = 'line';
   public lineChartPlugins = [];

   displayedColumns: string[] = ['year', 'count'];

   constructor(private reportService: ReportService) {
     super();
   }

   async ngOnInit(): Promise<void> {
     await this.loadData();
     this.refreshData();
   }

   async loadData(): Promise<any> {
     this.yearWiseData = await this.reportService.getYearWiseConsumerCount(10);
     this.lineChartLabels = [];
     this.lineChartData[0].data = [];
     for (const yearData of this.yearWiseData){
       this.lineChartLabels.unshift(yearData.year);
       this.lineChartData[0].data.unshift(yearData.count);
     }
   }

   updatePrivileges(): any {}

   print(): void{
     ReportHelper.print('yearWiseConsumerReport');
   }

 }
