import { Component, OnInit } from '@angular/core';
import { CustomAlertService } from '../services/custom-alert.service';
import { LoaderService } from '../services/loader.service';
import { ReportService } from '../services/report.service';
import { StorageService } from '../services/storage.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(
    private utilityService: UtilityService,
    private customAlertService: CustomAlertService,
    private storageService: StorageService,
    private loaderService: LoaderService,
    private reportService: ReportService
  ) { }

  public reportUnits = [
    {
      reportName: "Engagement Report - success scenario analysis across activity frequency and extent",
      fileName: "ER-suc-act.pdf",
      reportGenerateDate: "30 Nov 2021",
      status: 2
    },
    {
      reportName: "Engagement Summary - crowdsourced vs actualization information - 5 years",
      fileName: "ES-CAI.pdf",
      reportGenerateDate: "15 Nov 2021",
      status: 2
    },
    {
      reportName: "Engagement Summary - crowdsourced vs actualization information - 2 years",
      fileName: "ES-CAI-temp.pdf",
      reportGenerateDate: "21 Aug 2021",
      status: 1
    },
    {
      reportName: "Activity distribution across sellers and geo",
      fileName: "ACT_GEO.pdf",
      reportGenerateDate: "21 Aug 2021",
      status: 0
    },
    {
      reportName: "Seller profile report distribution - Industry and Technology vertical",
      fileName: "profile-snapshot.pdf",
      reportGenerateDate: "18 October 2020",
      status: 0
    }
  ]

  ngOnInit(): void {
  }

  downloadReport(reportUnit) {
    this.loaderService.startLoading();
    setTimeout(() => {
      this.reportService.generateExcel({}, reportUnit.fileName);
      this.loaderService.stopLoading();
    }, 4000);
  }
  showProgress(reportUnit) {
    this.customAlertService.showAlert("warn", "Report " + reportUnit.fileName + " - generation in progress.");
  }
  showNotAvailable(reportUnit) {
    this.customAlertService.showAlert("warn", "This report " + reportUnit.fileName + " is presently unavailable or withdrawn.");
  }

}
