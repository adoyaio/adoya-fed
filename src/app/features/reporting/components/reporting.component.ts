import { ClientService } from "./../../../core/services/client.service";
import { CostPerInstallDayObject } from "./../models/cost-per-install-day-object";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDatepickerInputEvent,
} from "@angular/material";
import {
  tap,
  merge,
  startWith,
  switchMap,
  map,
  catchError,
  combineAll,
} from "rxjs/operators";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent implements AfterViewInit {
  cpiHistory: CostPerInstallDayObject[] = [];
  displayedColumns: string[] = [
    "timestamp",
    "cpi",
    "installs",
    "revenue",
    "commerce-events",
    "spend",
  ];
  dataSource = new MatTableDataSource<CostPerInstallDayObject>(this.cpiHistory);
  resultsLength = 0;
  length = 365;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clientService: ClientService) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // this.dataSource
    //   .connect()
    //   .pipe(
    //     map((data) => {
    //       console.log("found data of length" + data.length);
    //     })
    //   )
    //   .subscribe();

    this.sort.sortChange
      .pipe(
        tap((val) => {
          console.log("sortChange::dir::" + val.direction);
          console.log("sortChange::active::" + val.active);
          this.cpiHistory.sort((a, b) => {
            if (val.active === "cpi") {
              if (val.direction === "asc") {
                return +a.cpi - +b.cpi;
              }
              return +b.cpi - +a.cpi;
            }
            if (val.active === "timestamp") {
              if (val.direction === "asc") {
                return +a.timestamp - +b.timestamp;
              }
              return +b.timestamp - +a.timestamp;
            }
          });
          this.dataSource.data = this.cpiHistory;
        })
      )
      .subscribe();

    //combineLatest([this.sort.sortChange, this.paginator.page])
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // return this.exampleDatabase!.getRepoIssues(
          //   this.sort.active, this.sort.direction, this.paginator.pageIndex);
          console.log(this.sort.direction);
          console.log(this.paginator.pageIndex);

          return this.clientService.getClientHistory(
            "1056410",
            this.paginator.pageSize
          );
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.paginator.length = this.cpiHistory.length;
          return data;
        }),

        catchError(() => {
          this.isLoadingResults = false;
          return [];
        })
      )
      .subscribe();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    console.log(event.value);
  }

  lengthChanged(event: any) {
    console.log(event.value);
    this.isLoadingResults = true;
    this.clientService
      .getClientHistory("1056410", this.paginator.pageSize)
      .pipe(
        map((data) => {
          this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
            data
          );
          this.dataSource.data = this.cpiHistory;
          this.paginator.length = this.cpiHistory.length;
          return data;
        }),
        tap((data) => {
          this.isLoadingResults = true;
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
