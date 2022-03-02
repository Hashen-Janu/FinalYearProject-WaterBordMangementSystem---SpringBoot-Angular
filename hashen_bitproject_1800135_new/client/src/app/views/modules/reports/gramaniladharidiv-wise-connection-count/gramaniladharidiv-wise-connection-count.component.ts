import { Component, OnInit } from '@angular/core';
import {ReportHelper} from '../../../../shared/report-helper';
import {ReportService} from '../../../../services/report.service';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ThemeManager} from '../../../../shared/views/theme-manager';

@Component({
  selector: 'app-gramaniladharidiv-wise-connection-count',
  templateUrl: './gramaniladharidiv-wise-connection-count.component.html',
  styleUrls: ['./gramaniladharidiv-wise-connection-count.component.scss']
})
export class GramaniladharidivWiseConnectionCountComponent extends AbstractComponent implements OnInit {

  Data: any[];

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
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  displayedColumns: string[] = ['gramaniladharidiv', 'count'];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.Data = await this.reportService.getGDivWiseConnectionCount();
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    for (const connectionData of this.Data){
      this.lineChartLabels.unshift(connectionData.gramaniladharidiv);
      this.lineChartData[0].data.unshift(connectionData.count);
    }
  }

  updatePrivileges(): any {}

  print(): void{
    ReportHelper.print('GramaniladharidivWiseConnectionReport');
  }

  // data: any[] = [];
  // tableData: any[] = [];
  // displayedColumns: string[] = ['gramaniladharidiv', 'count'];
  //
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   legend: { display: false }
  // };
  // public barChartLabels: Label[] = [];
  // public barChartType: ChartType = 'bar';
  // public barChartLegend = true;
  // public barChartPlugins = [];
  // public lineChartColors: Color[] = [{
  //   backgroundColor: 'rgba(0, 0, 255, 0.3)',
  // },
  // ];
  //
  // public barChartData: ChartDataSets[] = [
  //   { data: [], label: 'Connection Count' }
  // ];
  //
  // constructor(private reportService: ReportService) {
  //   super();
  // }
  //
  // async ngOnInit(): Promise<void> {
  //   await this.loadData();
  //   this.refreshData();
  // }
  //
  // async loadData(): Promise<any> {
  //   this.data = await this.reportService.getGDivWiseConnectionCount();
  //   let otherCount = 0;
  //   for (const d of this.data){
  //     if (d.count === 1){
  //       otherCount++;
  //     }
  //   }
  //   this.data.push({count: otherCount, gramaniladharidiv: 'gramaniladharidiv'});
  //
  //   this.data = this.data.filter((ob) => {
  //     return ob.count !== 1;
  //   });
  //   this.barChartLabels = [];
  //   this.barChartData[0].data = [];
  //
  //   for (const d of this.data){
  //     this.barChartLabels.push(d.gramaniladharidiv);
  //     this.barChartData[0].data.push(d.count);
  //   }
  //
  //   // Table Data
  //   this.tableData = this.data;
  // }
  //
  //
  //
  // updatePrivileges(): any {
  // }
  //
  // print(): void {
  //   ReportHelper.print('report');
  // }

}
