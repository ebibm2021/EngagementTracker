import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private coreHealthAPIUrl = environment.backendCoreUrl + '/api/health';
  private analyticsHealthAPIUrl = environment.backendAnalyticsUrl + '/api/health';

  constructor(private http: HttpClient) { }

  getCoreApiHealth(): Observable<any> {
    return this.http.get(this.coreHealthAPIUrl, {});
  }

  getAnalyticsApiHealth(): Observable<any> {
    return this.http.get(this.analyticsHealthAPIUrl, {});
  }
}
