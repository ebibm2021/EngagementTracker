import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { EngagementFormComponent } from './engagement-form/engagement-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { DataDisplayComponent } from './data-display/data-display.component';
import { AnalyticDisplayComponent } from './analytic-display/analytic-display.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { NgxEchartsModule } from 'ngx-echarts';
import { DataExchangeComponent } from './data-exchange/data-exchange.component';
import { TestComponent } from './test/test.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppService } from './app.service';


const routes: Routes = [
  {path:'web/welcome', component: WelcomeComponent},
  {path:'web/analytics', component: AnalyticDisplayComponent},
  {path:'web/data', component: DataDisplayComponent},
  {path:'web/test', component: TestComponent},
  { path: '', redirectTo: '/web/welcome', pathMatch: 'full' },
  { path: 'web', redirectTo: '/web/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/web/welcome', pathMatch: 'full' },
];

export function init_app(appService: AppService) {
  return () => appService.load();
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EngagementFormComponent,
    FooterComponent,
    ActivityFormComponent,
    DataDisplayComponent,
    AnalyticDisplayComponent,
    LoaderComponent,
    DataExchangeComponent,
    TestComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [{ 
    provide: APP_INITIALIZER, 
    useFactory: init_app, 
    deps: [ AppService ], 
    multi: true
  }],
  bootstrap: [AppComponent],
  exports: [
    RouterModule,
    MatDialogModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  entryComponents: [
    EngagementFormComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
