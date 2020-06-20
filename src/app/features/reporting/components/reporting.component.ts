import { ClientService } from "./../../../core/services/client.service";
import { CostPerInstallDayObject } from "./../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import {
  tap,
  merge,
  startWith,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent implements AfterViewInit {
  cpiHistory: CostPerInstallDayObject[] = [];
  displayedColumns: string[] = ["cpi", "installs", "timestamp", "spend"];
  dataSource = new MatTableDataSource<CostPerInstallDayObject>(this.cpiHistory);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private clientService: ClientService) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource
      .connect()
      .pipe(
        map((data) => {
          console.log("found data of length" + data.length);
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // return this.exampleDatabase!.getRepoIssues(
          //   this.sort.active, this.sort.direction, this.paginator.pageIndex);
          return this.clientService.getClientHistory("1056410");
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          return data;
        }),

        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();
  }

  // ngAfterViewInit() {
  //   //this.setupDataModel();
  //   this.clientService
  //     .getClientHistory("1056410")
  //     .pipe(
  //       tap((response) => {
  //         console.log("ngOnInit" + response);
  //         this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
  //           response
  //         );
  //       })
  //     )
  //     .subscribe();
  //   this.dataSource.paginator = this.paginator;
  // }

  // setupDataModel() {
  //   for (let i = 0; i < 365; i++) {
  //     const cpiObject = new CostPerInstallDayObject();
  //     cpiObject.cpi = 0.35;
  //     cpiObject.installs = 6;
  //     cpiObject.org_id = "1105630";
  //     cpiObject.spend = 2.1;
  //     cpiObject.timestamp = new Date(Date.now()).toDateString();
  //     this.cpiHistory.push(cpiObject);
  //   }
  // }
}
