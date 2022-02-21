import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  
  engagementAPIUrl:string;

  constructor(private http: HttpClient,private appService: AppService) { 
    this.engagementAPIUrl = this.appService.settings.BACKEND_CORE_URL + '/api/engagement';
   }
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
