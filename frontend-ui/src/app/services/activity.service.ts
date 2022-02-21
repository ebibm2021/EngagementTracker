import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  activityAPIUrl:string;
  activitiesAPIUrl:string
	
  constructor(private http: HttpClient,private appService: AppService) { 
    this.activityAPIUrl = this.appService.settings.BACKEND_CORE_URL + '/api/activity';
    this.activitiesAPIUrl = this.appService.settings.BACKEND_CORE_URL + '/api/activities';
  }
  
  getActivity(id): Observable<any> {
    return this.http.get(this.activityAPIUrl + '?engagement_id='+ id, {});
  }

  postActivity(jsonData): Observable<any> {
    return this.http.post(this.activityAPIUrl, jsonData);
  }

  putActivity(jsonData): Observable<any> {
    return this.http.put(this.activityAPIUrl, jsonData);
  }

  deleteActivity(id): Observable<any> {
    return this.http.delete(this.activityAPIUrl + '?id='+ id);
  }

  deleteActivities(engagementId): Observable<any> {
    return this.http.delete(this.activitiesAPIUrl + '?engagementid='+ engagementId);
  }
}
