import { Client } from "./../../features/reporting/models/client";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
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
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  // clientHistoryUrl = this.baseUrl + `/client/history`;
  // clientUrl = this.baseUrl + `/client`;

  // clientHistoryUrl = `/api/client/history`;
  // clientUrl = `/api/client`;

  public postClient(client: ClientPayload): Observable<any> {
    const url = `${this.clientPostUrl}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .post<any>(
        url,
        {
          operation: "create",
          tableName: "clients",
          payload: client,
        },
        { headers: headers }
      )
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
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .get<any>(url, { headers: headers })
      .pipe(
        map((response) => {
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
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .get<any>(url, { headers: headers })
      .pipe(
        map((response) => {
          return CostPerInstallDayObject.buildFromGetHistoryResponse(response);
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
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .get<any>(url, { headers: headers })
      .pipe(
        map((response) => {
          return CostPerInstallDayObject.buildFromGetHistoryResponse(response);
        }),
        catchError((error: HttpErrorResponse) => {
          throw new Error(error.message);
        })
      );
  }
}
