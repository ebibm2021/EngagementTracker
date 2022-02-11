import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivityService } from '../services/activity.service';
import { CustomAlertService } from '../services/custom-alert.service';
import { LoaderService } from '../services/loader.service';
import { StorageService } from '../services/storage.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit, AfterViewInit {
  
  public emitter = new EventEmitter();
  public engagementId = "";
  public mode = "none";
  public activityFormData:any = null;
  public activityCols: string[] = ['act', 'actedon', 'id', 'actions'];
  public activityData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;


  constructor( 
    private dialogRef: MatDialogRef<ActivityFormComponent>,
    private utilityService: UtilityService,
    private activityService: ActivityService,
    private customAlertService: CustomAlertService,
    private storageService: StorageService,
    private loaderService: LoaderService
  ) { }

  ngAfterViewInit(): void {
    this.activityData.paginator = this.paginator;
    this.activityData.sort = this.sort;
  }

  ngOnInit() {
    this.loaderService.startLoading();
    this.activityFormData = this.initBlankFormData();
    let storedData = this.storageService.retrieveAndClearActivityReferenceData();
    if (storedData == null) {
      this.customAlertService.showAlert("error", "Some error to retrieve activity details.");
      setTimeout(() => {
        this.closeDialog();
      },500);
    } else {
      this.engagementId = storedData.engagementId;
      this.loadActivity();
    }
  }

  loadActivity() {
    this.loaderService.startLoading();
    this.activityService.getActivity(this.engagementId).subscribe((response) => {
      if (response.info === "success") {
        this.activityData = new MatTableDataSource<any>(response.data);
        this.ngAfterViewInit();
        console.log(this.activityData)
        this.loaderService.stopLoading();
      }
      else {
        this.customAlertService.showAlert("error", "Some error to retrieve activity details.");
        setTimeout(() => {
          this.closeDialog();
        },500);
      }
    })
  }

  initBlankFormData() {
    return {
      act: new FormControl('', [Validators.required]),
      actedon: new FormControl('', [Validators.required]),
    };
  }

  initPreFilledFormData(data) {
    return {
      act: new FormControl(data.act, [Validators.required]),
      actedon: new FormControl(data.actedon, [Validators.required]),
      id: new FormControl(data.id, [Validators.required])
    };
  }

  closeDialog() {
    this.loaderService.stopLoading();
    this.dialogRef.close();
  }

  changeToAddMode() {
    this.activityFormData = this.initBlankFormData();
    this.mode = "add";
  }

  validateFields() {
    return true;
  }

  saveActivity() {
    this.loaderService.startLoading();
    if (this.validateFields()) {
      console.log(this.activityFormData)
      let dataJson = this.utilityService.convertFormControlObjectToDataJson(this.activityFormData);
      dataJson['engagementid'] = this.engagementId;
      console.log(dataJson);
      if (this.mode === 'add'){
        this.activityService.postActivity(dataJson).subscribe((response)=> {
          if (response.info === 'success') {
            this.customAlertService.showAlert("success", "Successfully saved Activity.");
            this.mode="none";
            this.loadActivity();
          }
          else {
            this.customAlertService.showAlert("error", "Error in saving engagement.");
            this.loaderService.stopLoading();
          }
        })
      }
      else if (this.mode === 'edit') {
        this.activityService.putActivity(dataJson).subscribe((response)=> {
          if (response.info === 'success') {
            this.customAlertService.showAlert("success", "Successfully updated engagement.");
            this.mode="none";
            this.loadActivity();
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
    this.mode = "none";

  }

  updateActivity() {
    this.mode = "none";

  }

  attemptToEditActivity(activityId) {
    let tempActivity = this.activityData.filteredData.filter((item)=>{
      return item.id == activityId;
    })[0];
    this.activityFormData = this.initPreFilledFormData(tempActivity);
    this.mode = "edit";
  }

  cancelAddMode() {
    this.mode = 'none';
    this.activityFormData = this.initBlankFormData();
  }
  
  cancelEditMode() {
    this.mode = 'none';
    this.activityFormData = this.initBlankFormData();
  }
  
  attemptToDeleteActivity(activityId) {
    //this.mode = "edit";
    if (confirm('Are you sure you want to delete the activity with id ' + activityId + ' ?')) {
      // Delete it!
      this.loaderService.startLoading();
      this.activityService.deleteActivity(activityId).subscribe((response) => {
        if (response.info === 'success'){
          this.customAlertService.showAlert('success', 'Deleted the activity with id ' + activityId +'.');
          this.loadActivity();
        }
        else {
          this.customAlertService.showAlert('error', 'Error on deleting the activity with id ' + activityId +'.');
          this.loaderService.stopLoading();
        }
      })
    } else {
      this.loaderService.stopLoading();
      // Do nothing!
    }
  }
}
