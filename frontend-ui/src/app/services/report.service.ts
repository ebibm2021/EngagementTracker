import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient, private appService: AppService
  ) { }

  generateExcel(dataJson, title) {

    let myMoment: moment.Moment = moment();
    var dateTimeString = myMoment.format('DD-MMM-YYYY HH-mm-ss');
 
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + ' - ' + dateTimeString + '.xlsx');
    })
  }
}
