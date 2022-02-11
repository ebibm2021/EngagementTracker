import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterAPIUrl = '/api/filter_groups';
  private analyticsAPIUrl = '/api/search_analytics';

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
