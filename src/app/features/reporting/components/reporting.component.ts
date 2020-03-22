import { CostPerInstallDayObject } from "./../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator } from "@angular/material";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"]
})
export class ReportingComponent implements OnInit {
  cpiHistory = [];
  displayedColumns: string[] = [
    "cpi",
    "installs",
    "orgId",
    "timestamp",
    "spend"
  ];

  dataSource = new MatTableDataSource<CostPerInstallDayObject>(this.cpiHistory);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.setupDataModel();
    this.dataSource.paginator = this.paginator;
  }

  setupDataModel() {
    for (let i = 0; i < 365; i++) {
      const cpiObject = new CostPerInstallDayObject();
      cpiObject.cpi = 0.35;
      cpiObject.installs = 6;
      cpiObject.orgId = "1105630";
      cpiObject.spend = 2.1;
      cpiObject.timestamp = new Date(Date.now()).toDateString();
      this.cpiHistory.push(cpiObject);
    }
  }
}
