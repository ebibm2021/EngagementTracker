import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomAlertService } from '../services/custom-alert.service';
import { EngagementService } from '../services/engagement.service';
import { LoaderService } from '../services/loader.service';
import { StorageService } from '../services/storage.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-engagement-form',
  templateUrl: './engagement-form.component.html',
  styleUrls: ['./engagement-form.component.css']
})
export class EngagementFormComponent implements OnInit {
  public emitter = new EventEmitter();

  public engagementData:any = {};
  public mode="";

  constructor(
    private dialogRef: MatDialogRef<EngagementFormComponent>,
    private utilityService: UtilityService,
    private engagementService: EngagementService,
    private customAlertService: CustomAlertService,
    private storageService: StorageService,
    private loaderService: LoaderService
  ) {
  };

  ngOnInit():void {
    this.loaderService.startLoading();
    let storedData = this.storageService.retrieveAndClearEngagementData();
    if (storedData == null) {
      this.engagementData = this.initFormData();
      this.mode = "add";
    } else {
      this.engagementData = this.initFormDataFromStoredData(storedData);
      this.mode = "edit";
    }
    this.loaderService.stopLoading();
  };

  initFormData() {
    return {
      market: new FormControl('', [Validators.required]),
      customer: new FormControl('', [Validators.required]),
      opportunity: new FormControl('', [Validators.required]),
      sellerexec: new FormControl('', [Validators.required]),
      ctpsca: new FormControl('', [Validators.required]),
      partner: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      product: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      labsme: new FormControl('', [Validators.required]),
      requestedon: new FormControl('', [Validators.required]),
      completedon: new FormControl('', [Validators.required]),
      result: new FormControl('', [Validators.required]),
      effort: new FormControl(0, [Validators.required]),
      comments: new FormControl('', [Validators.required])
    };
  }

  initFormDataFromStoredData(storedData) {
    return {
      market: new FormControl(storedData.market, [Validators.required]),
      customer: new FormControl(storedData.customer, [Validators.required]),
      opportunity: new FormControl(storedData.opportunity, [Validators.required]),
      sellerexec: new FormControl(storedData['seller/exec'], [Validators.required]),
      ctpsca: new FormControl(storedData['ctp/sca'], [Validators.required]),
      partner: new FormControl(storedData.partner, [Validators.required]),
      category: new FormControl(storedData.category, [Validators.required]),
      product: new FormControl(storedData.product, [Validators.required]),
      description: new FormControl(storedData.description, [Validators.required]),
      status: new FormControl(storedData.status, [Validators.required]),
      labsme: new FormControl(storedData.labsme, [Validators.required]),
      requestedon: new FormControl(storedData.requestedon, [Validators.required]),
      completedon: new FormControl(storedData.completedon, [Validators.required]),
      result: new FormControl(storedData.result, [Validators.required]),
      effort: new FormControl(storedData.effort, [Validators.required]),
      comments: new FormControl(storedData.comments, [Validators.required]),
      id: new FormControl(storedData.id, [Validators.required]),
    };
  }

  cancelDialog() {
    this.dialogRef.close();
  }

  saveEngagement() {
    this.loaderService.startLoading();
    if (this.validateFields()) {
      console.log(this.engagementData)
      let dataJson = this.utilityService.convertFormControlObjectToDataJson(this.engagementData);
      console.log(dataJson);
      if (this.mode === 'add'){
        this.engagementService.postEngagement(dataJson).subscribe((response)=> {
          if (response.info === 'success') {
            this.customAlertService.showAlert("success", "Successfully saved engagement.");
            setTimeout(()=>{
              this.loaderService.stopLoading();
              this.emitter.next(null);
              this.cancelDialog();
            },500)
          }
          else {
            this.customAlertService.showAlert("error", "Error in saving engagement.");
            this.loaderService.stopLoading();
          }
        })
      }
      else if (this.mode === 'edit') {
        this.engagementService.putEngagement(dataJson).subscribe((response)=> {
          if (response.info === 'success') {
            this.customAlertService.showAlert("success", "Successfully saved engagement.");
            setTimeout(()=>{
              this.loaderService.stopLoading();
              this.emitter.next(null);
              this.cancelDialog();
            },500)
          }
          else {
            this.customAlertService.showAlert("error", "Error in saving engagement.");
            this.loaderService.stopLoading();
          }
        })
      }
    } else {
      this.customAlertService.showAlert("warn", "Fix validations.");
      this.loaderService.stopLoading(); 
    }
  }

  validateFields() {
    for (var key in this.engagementData) {
      if (this.engagementData.hasOwnProperty(key)) {
        if (!this.engagementData[key].valid) {
          return false;
        }
      }
    }
    return true;
  }
}



