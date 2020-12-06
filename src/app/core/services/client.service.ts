import { Client } from "../models/client";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CostPerInstallDayObject } from "src/app/features/reporting/models/cost-per-install-day-object";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { KeywordDayObject } from "src/app/features/reporting/models/keyword-day-object";
import { OffsetObject } from "src/app/features/reporting/models/offset-object";
import { ClientPayload } from "../models/client-payload";

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
    offsetKey: string,
    startDate: string,
    endDate: string,
    matchType: string,
    keywordStatus: string
  ): Observable<[KeywordDayObject[], OffsetObject, number]> {
    let offsetIndexComposite = offsetKey.split("|");
    const offsetOrgId = offsetIndexComposite[0];
    const offsetKeywordId = offsetIndexComposite[1];
    const offsetDate = offsetIndexComposite[2];
    const startDateParam = startDate.length > 0 ? startDate : "all";
    const endDateParam = endDate.length > 0 ? endDate : "all";
    const matchTypeParam = matchType.length > 0 ? matchType : "all";
    const keywordStatusParam = keywordStatus.length > 0 ? keywordStatus : "all";
    const url = `${this.clientKeywordHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}&offsetOrgId=${offsetOrgId}&offsetKeywordId=${offsetKeywordId}&offsetDate=${offsetDate}&start_date=${startDateParam}&end_date=${endDateParam}&matchType=${matchTypeParam}&keywordStatus=${keywordStatusParam}`;
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
