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
export class ExchangeService {

  private headerMappings = [
    { "key": "category", "header": "CATEGORY" },
    { "key": "completedon", "header": "COMPLETED ON" },
    { "key": "ctp/sca", "header": "CTP/SCA" },
    { "key": "customer", "header": "CUSTOMER" },
    { "key": "description", "header": "DESCRIPTION" },
    { "key": "effort", "header": "EFFORT" },
    { "key": "labsme", "header": "LAB SME" },
    { "key": "lastupdatedon", "header": "LAST UPDATED ON" },
    { "key": "market", "header": "MARKET" },
    { "key": "opportunity", "header": "OPPORTUNITY" },
    { "key": "partner", "header": "PARTNER" },
    { "key": "product", "header": "PRODUCT" },
    { "key": "requestedon", "header": "REQUESTED ON" },
    { "key": "result", "header": "RESULT" },
    { "key": "seller/exec", "header": "SELLER/EXEC" },
    { "key": "status", "header": "STATUS" },
    { "key": "comments", "header": "COMMENTS" },
    { "key": "activitydata", "header": "ACTIVITY DATA" }
  ];

  private dummyTemplateData = [{
    "market": "market info",
    "customer": "customer name",
    "opportunity": "opportunity name",
    "seller/exec": "seller executive name",
    "ctp/sca": "CTP / SCA name",
    "partner": "partner name",
    "category": "category details",
    "product": "product name",
    "description": "engagement description",
    "status": "engagement status",
    "labsme": "Lab SME name",
    "requestedon": "requested on date dd-MMM-YYYY",
    "completedon": "cormpleted on date dd-MMM-YYYY",
    "result": "engament result",
    "effort": "effort in numbers",
    "comments": "more comments",
    "activitydata": "one activity text <#> one activity date dd-MMM-YYYY <newline> another activity text <#> another activity date dd-MMM-YYYY  <newline>",
    "lastupdatedon": "last updated on date dd-MMM-YYYY"
  }, {
    "market": "ISA",
    "customer": "New World Networks",
    "opportunity": "GLOBAL-SOC-NWN",
    "seller/exec": "Tommy Tames",
    "ctp/sca": "Sarah Simpson",
    "partner": "GlobeNet",
    "category": "POC",
    "product": "ICP4D, ICP4A",
    "description": "Network software on Cloud Pak",
    "status": "Active",
    "labsme": "Jim Jester",
    "requestedon": "01-Feb-2018",
    "completedon": "01-Feb-2020",
    "result": "WON",
    "effort": 180,
    "comments": "Sample engagement",
    "activitydata": "requirement finalized#01-Mar-2018\ndevelopment started#01-Jul-2018\ncompleted#01-Dec-2019\n",
    "lastupdatedon": "01-Dec-2019"
  }]

  constructor(
    private http: HttpClient, private appService: AppService
  ) { }

  generateExcel(dataJson, title) {
    let myMoment: moment.Moment = moment();
    var dateTimeString = myMoment.format('DD-MMM-YYYY HH-mm-ss');

    //Excel Header
    let header = this.headerMappings.map((headerMapping) => {
      return headerMapping.header;
    })

    let data = [];
    data = dataJson.map((datumJson) => {
      let datumArr = [];
      for (let i = 0; i < this.headerMappings.length; i++) {
        let thisDataUnit = datumJson[this.headerMappings[i].key];
        thisDataUnit = this.formatData1(this.headerMappings[i].key, thisDataUnit)
        datumArr.push(thisDataUnit)
      }
      return datumArr;
    })

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Engagement Report');

    //Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    // Add Data Rows
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      })
    });

    // Set Column widths
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 15;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength + 5;
        }
      });
      column.width = maxLength < 15 ? 15 : maxLength;
    });

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + ' - ' + dateTimeString + '.xlsx');
    })
  }
  formatData1(key: string, thisDataUnit: any): any {
    var newDataUnit = "";
    if (key === 'activitydata') {
      console.log(thisDataUnit)
      if (thisDataUnit != undefined && thisDataUnit != null ) {
        if (typeof thisDataUnit === 'string' || thisDataUnit instanceof String) {
          newDataUnit = thisDataUnit.replaceAll('$', '\n')
        } else if (Array.isArray(thisDataUnit)) {
          for (var i = 0; i < thisDataUnit.length; i++) {
            newDataUnit = newDataUnit + thisDataUnit[i] + "\n";
          }
        }
      }
    }
    else {
      newDataUnit = thisDataUnit;
    }
    return newDataUnit;
  }

  formatData2(activityUnits: any): any {
    let activities = [];
    if (activityUnits != undefined && activityUnits != null && activityUnits != '') {
      activityUnits.split('\n').forEach(activityUnit => {
        if (activityUnit != null && activityUnit != undefined) {
          activityUnit = activityUnit.trim();
          if (activityUnit != "" && activityUnit.includes("#")) {
            let countOfSeparators = (activityUnit.match(new RegExp("#", "g")) || []).length;
            if (countOfSeparators == 1) {
              activities.push({
                'act': activityUnit.split('#')[0],
                'actedon': activityUnit.split('#')[1]
              })
            }
          }
        }
      });
    }
    return activities;
  }

  getTemplateData() {
    return this.dummyTemplateData;
  }

  parseExcel(event) {
    return new Promise((resolve, reject) => {
      let result = {
        status: false,
        data: []
      }
      let headerMappingsLocal = [];

      try {
        const workbook = new Excel.Workbook();
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) {
          throw new Error('Cannot use multiple files');
        }

        /** Final Solution For Importing the Excel FILE */
        const arrayBuffer = new Response(target.files[0]).arrayBuffer();
        arrayBuffer.then((data) => {
          workbook.xlsx.load(data)
            .then(() => {
              // play with workbook and worksheet now
              console.log(workbook);
              const worksheet = workbook.getWorksheet(1);
              console.log('rowCount: ', worksheet.rowCount);
              let headerValues = [];
              worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                  // header row, lets save the values
                  headerValues = row.values;
                  console.log(headerValues);
                  row.eachCell((cell, colNumber) => {
                    console.log('Cell ' + colNumber + ' = ' + cell.value);
                    let filteredHeader = this.headerMappings.filter(headerMapping => {
                      return headerMapping.header === cell.value.trim().toUpperCase();
                    })[0];
                    filteredHeader["index"] = colNumber
                    headerMappingsLocal.push(filteredHeader);
                  });
                  console.log(headerMappingsLocal);
                }
                else {
                  // body rows
                  let element = {};
                  row.eachCell((cell, colNumber) => {
                    console.log('Cell ' + colNumber + ' = ' + cell.value);
                    let headerMappingLocal = headerMappingsLocal.filter((headerMapping) => {
                      return colNumber === headerMapping.index;
                    })[0];
                    element[headerMappingLocal.key] = cell.value;
                  });
                  element['activities']=this.formatData2(element['activitydata']);
                  result.data.push(element);
                }
              });
              result.status = true;
              resolve(result)
            });
        });
      } catch (err) {
        result.status = false;
        resolve(result);
      }
    })
  }

  public uploadEngagementActivityData(data) {
      return this.http.post(this.appService.settings.BACKEND_CORE_URL + '/api/bulk-upload', data);
  }
}
