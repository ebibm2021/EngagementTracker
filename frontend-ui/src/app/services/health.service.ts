import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private coreHealthAPIUrl = '/api/health';
  private analyticsHealthAPIUrl = '/api/health';

  constructor(private http: HttpClient) { }

  getCoreApiHealth(): Observable<any> {
    return this.http.get(this.coreHealthAPIUrl, {});
  }

  getAnalyticsApiHealth(): Observable<any> {
    return this.http.get(this.analyticsHealthAPIUrl, {});
  }
}
