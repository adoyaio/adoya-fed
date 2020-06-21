import { FormBuilder, FormControl } from "@angular/forms";
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
  delay,
} from "rxjs/operators";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-reporting",
  templateUrl: "./reporting.component.html",
  styleUrls: ["./reporting.component.scss"],
})
export class ReportingComponent implements AfterViewInit, OnInit {
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

  // listSizeControl: FormControl = this.fb.control(365);
  constructor(private clientService: ClientService, private fb: FormBuilder) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

    // this.listSizeControl.valueChanges
    //   .pipe(
    //     startWith(365),
    //     switchMap((val) => {
    //       this.isLoadingResults = true;
    //       // return this.exampleDatabase!.getRepoIssues(
    //       //   this.sort.active, this.sort.direction, this.paginator.pageIndex);
    //       console.log(this.sort.direction);
    //       console.log(this.paginator.pageIndex);

    //       return this.clientService.getClientHistory("1056410", val);
    //     }),
    //     map((data) => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
    //         data
    //       );
    //       this.dataSource.data = this.cpiHistory;
    //       this.paginator.length = this.cpiHistory.length;
    //       return data;
    //     }),

    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return [];
    //     })
    //   )
    //   .subscribe();

    this.clientService
      .getClientHistory("1056410", 1000)
      .pipe(
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

    this.sort.sortChange
      .pipe(
        delay(0),
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
            if (val.active === "spend") {
              if (val.direction === "asc") {
                return +a.spend - +b.spend;
              }
              return +b.spend - +a.spend;
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
    // this.paginator.page
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       // return this.exampleDatabase!.getRepoIssues(
    //       //   this.sort.active, this.sort.direction, this.paginator.pageIndex);
    //       console.log(this.sort.direction);
    //       console.log(this.paginator.pageIndex);
    //       console.log(this.paginator.pageSize);

    //       return this.clientService.getClientHistory(
    //         "1056410",
    //         this.paginator.pageIndex,
    //         this.paginator.pageSize
    //       );
    //     }),
    //     map((data) => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.cpiHistory = CostPerInstallDayObject.buildFromGetHistoryResponse(
    //         data
    //       );
    //       this.dataSource.data = this.cpiHistory;
    //       this.paginator.length = this.cpiHistory.length;
    //       return data;
    //     }),

    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return [];
    //     })
    //   )
    //   .subscribe();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    console.log(event.value);
  }

  listSizeChanged(event: any) {
    this.isLoadingResults = true;

    // TODO pull from token service
    this.clientService
      .getClientHistory("1056410", event.target.value)
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
          this.isLoadingResults = false;
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
