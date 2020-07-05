import { Client } from "./../../features/reporting/models/client";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { CostPerInstallDayObject } from "src/app/features/reporting/models/cost-per-install-day-object";
import { map, catchError } from "rxjs/operators";
import { ClientPayload } from "src/app/features/reporting/models/client-payload";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.baseUrl;

  clientHistoryUrl = this.baseUrl + `/client/history`;
  clientGetUrl = this.baseUrl + `/client/get`;
  clientPostUrl = this.baseUrl + `/client/post`;

  // clientHistoryUrl = this.baseUrl + `/client/history`;
  // clientUrl = this.baseUrl + `/client`;

  // clientHistoryUrl = `/api/client/history`;
  // clientUrl = `/api/client`;

  public postClient(client: ClientPayload): Observable<any> {
    // const url = `${this.clientUrl}`;
    const url = `${this.clientPostUrl}`;
    return this.http
      .post<any>(url, {
        operation: "create",
        tableName: "clients",
        payload: client,
      })
      .pipe(
        map((response) => {
          console.log("putClient");
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw new Error(error.message);
        })
      );
  }

  public getClient(orgId: string): Observable<Client[]> {
    const url = `${this.clientGetUrl}?org_id=${orgId}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log("getClient");
        return response[0];
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error(error.message);
      })
    );
  }

  public getClientHistory(
    orgId: string,
    pageSize: number
  ): Observable<CostPerInstallDayObject[]> {
    const url = `${this.clientHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log("getClientHistory");
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error(error.message);
      })
    );
  }

  public getClientHistoryByTime(
    orgId: string,
    startDate: string,
    endDate: string
  ): Observable<CostPerInstallDayObject[]> {
    const url = `${this.clientHistoryUrl}?org_id=${orgId}&start_date=${endDate}&end_date=${startDate}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log("getClientHistoryByTime");
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error(error.message);
      })
    );
  }
}
