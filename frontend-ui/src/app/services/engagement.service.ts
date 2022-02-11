import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  
  private engagementAPIUrl = '/api/engagement';

	constructor(private http: HttpClient) { }
  
  getEngagement(): Observable<any> {
    return this.http.get(this.engagementAPIUrl, {});
  }

  postEngagement(jsonData): Observable<any> {
    return this.http.post(this.engagementAPIUrl, jsonData);
  }

  putEngagement(jsonData): Observable<any> {
    return this.http.put(this.engagementAPIUrl, jsonData);
  }

  deleteEngagement(id): Observable<any> {
    return this.http.delete(this.engagementAPIUrl + '?id='+ id);
  }
  
}
