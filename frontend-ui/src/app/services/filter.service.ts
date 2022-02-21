import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterAPIUrl:string;
  analyticsAPIUrl :string;

  constructor(private http: HttpClient,private appService: AppService) { 
    this.filterAPIUrl = this.appService.settings.BACKEND_ANALYTICS_URL + '/api/filter_groups';
    this.analyticsAPIUrl = this.appService.settings.BACKEND_ANALYTICS_URL + '/api/search_analytics';
   }

  getFilterGroups(): Observable<any> {
    return this.http.get(this.filterAPIUrl, {});
  }

  postSearchAnalytics(filter): Observable<any> {
    return this.http.post(this.analyticsAPIUrl, {filters: filter});
  }
}
