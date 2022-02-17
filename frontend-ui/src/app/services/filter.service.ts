import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterAPIUrl = environment.backendAnalyticsUrl + '/api/filter_groups';
  private analyticsAPIUrl = environment.backendAnalyticsUrl + '/api/search_analytics';

  constructor(
    private http: HttpClient
  ) { }

  getFilterGroups(): Observable<any> {
    return this.http.get(this.filterAPIUrl, {});
  }

  postSearchAnalytics(filter): Observable<any> {
    return this.http.post(this.analyticsAPIUrl, {filters: filter});
  }
}
