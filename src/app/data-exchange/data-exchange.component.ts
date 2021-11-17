import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EngagementFormComponent } from '../engagement-form/engagement-form.component';
import { CustomAlertService } from '../services/custom-alert.service';
import { EngagementService } from '../services/engagement.service';
import { ExchangeService } from '../services/exchange.service';
import { LoaderService } from '../services/loader.service';
import { StorageService } from '../services/storage.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-data-exchange',
  templateUrl: './data-exchange.component.html',
  styleUrls: ['./data-exchange.component.css']
})
export class DataExchangeComponent implements OnInit {
  public emitter = new EventEmitter();
  private dataToUpload = {
    status: false,
    data: []
  }

  constructor(
    private dialogRef: MatDialogRef<EngagementFormComponent>,
    private utilityService: UtilityService,
    private engagementService: EngagementService,
    private customAlertService: CustomAlertService,
    private storageService: StorageService,
    private loaderService: LoaderService,
    private exchangeService: ExchangeService
  ) { }

  ngOnInit(): void {
    this.loaderService.startLoading();

    this.loaderService.stopLoading();
  }

  cancelDialog() {
    this.dialogRef.close();
  }

  downloadTemplate() {
    this.loaderService.startLoading();
    this.exchangeService.generateExcel(this.exchangeService.getTemplateData(), 'Template');
    this.loaderService.stopLoading();
  }

  downloadData() {
    this.loaderService.startLoading();
    this.engagementService.getEngagement().subscribe((response) => {
      console.log(response.data);
      this.exchangeService.generateExcel(response.data, 'Engagement Report');
      this.loaderService.stopLoading();
    })
  }

  uploadData() {
    this.loaderService.startLoading();
    if (this.dataToUpload.status) {
      this.exchangeService.uploadEngagementActivityData(this.dataToUpload.data).subscribe((data: any)=> {
        if (data['info'] =="success") {
          alert("Successfully Uploaded")
          this.clearInput();
          this.loaderService.stopLoading();
          this.cancelDialog();
        }
        else {
          alert("Error: Check Logs")
          this.clearInput();
          this.loaderService.stopLoading();
        }
      })
    } else {
      alert("Select correct file with data");
      this.clearInput();
      this.loaderService.stopLoading();
    }
  }

  private clearInput() {
    this.dataToUpload = {
      status: false,
      data: []
    };
    (<HTMLInputElement>document.getElementById("upload-file")).value = "";
  }

  readExcel(event) {
    this.exchangeService.parseExcel(event).then((excelData: any)=> {
      console.log(excelData);
      if (excelData["status"]) {
        alert("Data okay, please proceed for upload.");
        this.dataToUpload = excelData;
      }
      else {
        alert("Data failed in validation, please check your excel file following template.");
      }
    })
  }

}
