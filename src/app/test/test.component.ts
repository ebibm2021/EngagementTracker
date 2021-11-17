import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { CustomAlertService } from '../services/custom-alert.service';
import { EngagementService } from '../services/engagement.service';
import { LoaderService } from '../services/loader.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private engagementService: EngagementService,
    private activityService: ActivityService,
    private customAlertService: CustomAlertService,
    private loaderService: LoaderService,
    private storageService: StorageService) { }

  ngOnInit(): void {
  }
  public value1: number = 5;
  public value2: number = 7;
  public result1: string = '';
  public result2: string = '';


  test1() {
    this.clearInputs()
    this.loaderService.startLoading();
    let promises = [];
    for (var i = 0; i < this.value1; i++) {
      promises.push(new Promise((resolve, reject) => {
        this.engagementService.getEngagement().subscribe((result) => {
          resolve(result);
        })
      }))
    }
    Promise.all(promises).then((values) => {
      console.log(values)
      this.result1 = ''+JSON.stringify(values);
      this.loaderService.stopLoading();
    })

  }
  test2() {
    console.log("insert")
    this.clearInputs()
    this.loaderService.startLoading();
    let promises = [];
    for (var i = 0; i < this.value2; i++) {
      promises.push(new Promise((resolve, reject) => {
        this.engagementService.postEngagement({
          market: "",
          customer: "",
          opportunity: "",
          sellerexec: "",
          ctpsca: "",
          partner: "",
          category: "",
          product: "",
          description: "",
          status: "",
          labsme: "",
          requestedon: "2021-01-01",
          completedon: "2021-01-01",
          result: "",
          effort: 0,
          comments: "",
          id: 1
        }).subscribe((result) => {
          resolve(result);
        })
      }))
    }
    Promise.all(promises).then((values) => {
      console.log(values)
      this.result2 = ''+JSON.stringify(values);
      this.loaderService.stopLoading();
    })

  }

  clearInputs(){
    this.result1 = '';
    this.result2 = '';
  }
}
