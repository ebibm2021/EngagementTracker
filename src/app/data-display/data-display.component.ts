import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { DataExchangeComponent } from '../data-exchange/data-exchange.component';
import { EngagementFormComponent } from '../engagement-form/engagement-form.component';
import { ActivityService } from '../services/activity.service';
import { CustomAlertService } from '../services/custom-alert.service';
import { EngagementService } from '../services/engagement.service';
import { LoaderService } from '../services/loader.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css']
})
export class DataDisplayComponent implements OnInit {

  public engagementCols: string[] = ['actions', 'opportunity', 'market', 'customer', 'seller/exec', 'ctp/sca', 'partner', 'category', 'product', 'description', 'status', 'labsme', 'requestedon', 'completedon', 'result', 'effort', 'comments', 'id','lastupdatedon'];
  public engagements: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public filterString = "";
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    public dialog: MatDialog,
    private engagementService: EngagementService,
    private activityService: ActivityService,
    private customAlertService: CustomAlertService,
    private loaderService: LoaderService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.loadEngagementData();
  }

  ngAfterViewInit() {
    this.engagements.paginator = this.paginator!;
    this.engagements.sort = this.sort!;
  }

  loadEngagementData() {
    this.loaderService.startLoading();
    this.filterString = "";
    this.engagementService.getEngagement().subscribe((response) => {
      console.log(response.data)
      let modifiedData:any = this.enhanceEngagementData(response.data)
      this.engagements = new MatTableDataSource<any>(modifiedData);
      console.log(this.engagements)
      this.ngAfterViewInit();
      this.loaderService.stopLoading();
    })
  }

  enhanceEngagementData(engagementArray) {
    // engagementArray = engagementArray.map((elem)=>{
    //   // get actual max date from comments date
    //   elem['lastupdatedon'] = elem['requestedon'];
    //   return elem;
    // })
    return engagementArray;
  }

  editEngagement(engagementId: string) {
    var engagementData = this.engagements.filteredData.filter((item)=>{
      return item.id == engagementId;
    })[0];
    console.log(engagementData)
    this.storageService.preserveEngagementData(engagementData);
    this.openEngagementFormDialog()
  }

  deleteEngagement(engagementId: string) {
    if (confirm('Are you sure you want to delete the engagement with id ' + engagementId + ' along with all activities ?')) {
      // Delete it!
      this.loaderService.startLoading();

      this.activityService.deleteActivities(engagementId).subscribe((response1)=> {
        if (response1.info === 'success'){
          this.engagementService.deleteEngagement(engagementId).subscribe((response2) => {
            if (response2.info === 'success'){
              this.customAlertService.showAlert('success', 'Deleted the engagement with id ' + engagementId +'.');
              this.loadEngagementData();
            }
            else {
              this.customAlertService.showAlert('error', 'Error on deleting the engagement with id ' + engagementId +'.');
              this.loaderService.stopLoading();
            }
          })
        }
        else {
          this.customAlertService.showAlert('error', 'Error on deleting the engagement with id ' + engagementId +'.');
          this.loaderService.stopLoading();
        }
      })
      
    } else {
      this.loaderService.stopLoading();
      // Do nothing!
    }
  }

  manageActivity(engagementId: string){
    this.storageService.preserveActivityReferenceData({engagementId: engagementId});
    this.openActivityFormDialog()
  }

  addEngagement() {
    this.storageService.retrieveAndClearEngagementData();
    this.openEngagementFormDialog()
  }

  openEngagementFormDialog() {
    const dialogRef = this.dialog.open(EngagementFormComponent, {
      height: '80%',
      width: '80%'
    });
    const subscriptionToDialog = dialogRef.componentInstance.emitter.subscribe((data) => {
      console.log('dialog data', data);
      this.loadEngagementData();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      subscriptionToDialog.unsubscribe();
    });
  }

  openActivityFormDialog() {
    const dialogRef = this.dialog.open(ActivityFormComponent, {
      height: '80%',
      width: '80%'
    });
    const subscriptionToDialog = dialogRef.componentInstance.emitter.subscribe((data) => {
      console.log('dialog data', data);
      this.loadEngagementData();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      subscriptionToDialog.unsubscribe();
      this.loadEngagementData();
    });
  }

  exchangeModal() {
    const dialogRef = this.dialog.open(DataExchangeComponent, {
      height: '30%',
      width: '50%'
    });
    const subscriptionToDialog = dialogRef.componentInstance.emitter.subscribe((data) => {
      console.log('dialog data', data);
      this.loadEngagementData();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      subscriptionToDialog.unsubscribe();
      this.loadEngagementData();
    });
  }

  public doFilter = () => {
    this.engagements.filter = this.filterString;
  }
}