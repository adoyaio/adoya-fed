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
import { KeywordDayObject } from "src/app/features/reporting/models/keyword-day-object";
import { OffsetObject } from "src/app/features/reporting/models/offset-object";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.baseUrl;

  clientCostHistoryUrl = this.baseUrl + `/client/cost/history`;
  clientKeywordHistoryUrl = this.baseUrl + `/client/keyword/history`;
  clientGetUrl = this.baseUrl + `/client/get`;
  clientPostUrl = this.baseUrl + `/client/post`;
  clientAdminUrl = this.baseUrl + `/client/admin`;
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

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

  public getClientCostHistory(
    orgId: string,
    pageSize: number
  ): Observable<CostPerInstallDayObject[]> {
    const url = `${this.clientCostHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}`;
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

  public getClientCostHistoryByTime(
    orgId: string,
    startDate: string,
    endDate: string
  ): Observable<CostPerInstallDayObject[]> {
    const url = `${this.clientCostHistoryUrl}?org_id=${orgId}&start_date=${endDate}&end_date=${startDate}`;
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

  public getClientKeywordHistory(
    orgId: string,
    pageSize: number,
    offsetKey: string
  ): Observable<[KeywordDayObject[], OffsetObject, number]> {
    let offsetIndexComposite = offsetKey.split("|");
    const offsetOrgId = offsetIndexComposite[0];
    const offsetKeywordId = offsetIndexComposite[1];
    const offsetDate = offsetIndexComposite[2];
    const url = `${this.clientKeywordHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}&offsetOrgId=${offsetOrgId}&offsetKeywordId=${offsetKeywordId}&offsetDate=${offsetDate}`;
    let headers = new HttpHeaders();

    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .get<any>(url, { headers: headers })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw new Error(error.message);
        })
      );
  }

  // public getClientHistoryByTime(
  //   orgId: string,
  //   startDate: string,
  //   endDate: string
  // ): Observable<CostPerInstallDayObject[]> {
  //   const url = `${this.clientCostHistoryUrl}?org_id=${orgId}&start_date=${endDate}&end_date=${startDate}`;
  //   let headers = new HttpHeaders();
  //   headers = headers.set("x-api-key", this.authKey);
  //   return this.http
  //     .get<any>(url, { headers: headers })
  //     .pipe(
  //       map((response) => {
  //         return CostPerInstallDayObject.buildFromGetHistoryResponse(response);
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         throw new Error(error.message);
  //       })
  //     );
  // }
}
