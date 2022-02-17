import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  coreHealthAPIUrl:string;
  analyticsHealthAPIUrl:string;

  constructor(private http: HttpClient,private appService: AppService) { 
    this.coreHealthAPIUrl = this.appService.settings.backendCoreUrl + '/api/health';
    this.analyticsHealthAPIUrl = this.appService.settings.backendAnalyticsUrl + '/api/health';
   }

  getCoreApiHealth(): Observable<any> {
    return this.http.get(this.coreHealthAPIUrl, {});
  }

  getAnalyticsApiHealth(): Observable<any> {
    return this.http.get(this.analyticsHealthAPIUrl, {});
  }
}
