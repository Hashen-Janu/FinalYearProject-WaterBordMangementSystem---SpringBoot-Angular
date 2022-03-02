import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from './shared/configuration.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  isCheckedConfiguration = false;
  isConfigured = false;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.configurationService.checkConfiguration()
      .then(() => {
        this.isConfigured = true;
        this.isCheckedConfiguration = true;
      })
      .catch((e: HttpErrorResponse) => {

        this.isConfigured = false;
        this.isCheckedConfiguration = true;

        if (e.status === 0){
          this.snackBar.open('Something is wrong. Maybe the server not running.', 'Error');
        } else if (e.status === 503){

        }else{
          this.snackBar.open('Something is wrong.', 'Error');
        }
      });
  }
}
