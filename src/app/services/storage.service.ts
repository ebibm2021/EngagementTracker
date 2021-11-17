import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public preserveEngagementData(data): void {
    localStorage.setItem("engagement_data", JSON.stringify(data) );
  }

  public preserveActivityReferenceData(data): void {
    localStorage.setItem("engagement_reference_data", JSON.stringify(data) );
  }

  public retrieveAndClearEngagementData(): any {
    let data = localStorage.getItem("engagement_data");
    if (data === null) {
      return null;
    }
    else {
      let info = JSON.parse(data);
      localStorage.removeItem("engagement_data");
      return info;
    }
  }

  public retrieveAndClearActivityReferenceData(): any {
    let data = localStorage.getItem("engagement_reference_data");
    if (data === null) {
      return null;
    }
    else {
      let info = JSON.parse(data);
      localStorage.removeItem("engagement_reference_data");
      return info;
    }
  }
}
