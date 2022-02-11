import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activityAPIUrl = '/api/activity';
  private activitiesAPIUrl = '/api/activities';
	
  constructor(private http: HttpClient) { }
  
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
