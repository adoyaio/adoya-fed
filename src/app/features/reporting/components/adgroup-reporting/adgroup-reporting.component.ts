import { Component, OnInit } from "@angular/core";
import { ReportingService } from "../../reporting.service";

@Component({
  selector: "app-adgroup-reporting",
  templateUrl: "./adgroup-reporting.component.html",
  styleUrls: ["./adgroup-reporting.component.scss"],
})
export class AdgroupReportingComponent implements OnInit {
  constructor(public reportingService: ReportingService) {}

  ngOnInit() {
    this.reportingService.isLoadingAdgroups = false;
  }
}
