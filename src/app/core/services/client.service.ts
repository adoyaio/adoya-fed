import { Client } from "../models/client";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CostPerInstallDayObject } from "src/app/features/reporting/models/cost-per-install-day-object";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { KeywordDayObject } from "src/app/features/reporting/models/keyword-day-object";
import {
  CampaignOffsetObject,
  CpiOffsetObject,
  OffsetObject,
} from "src/app/features/reporting/models/offset-object";
import { ClientPayload } from "../models/client-payload";
import { get as _get, isNil, reduce } from "lodash";
import { UserAccountService } from "./user-account.service";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  constructor(
    private http: HttpClient,
    private userAccountservice: UserAccountService
  ) {}

  baseUrl = environment.baseUrl;

  clientCostHistoryUrl = this.baseUrl + `/client/cost/history`;
  clientKeywordHistoryUrl = this.baseUrl + `/client/keyword/history`;
  clientCampaignHistoryUrl = this.baseUrl + `/client/campaign/history`;
  clientGetUrl = this.baseUrl + `/client/get`;
  clientPostUrl = this.baseUrl + `/client/post`;
  clientPatchUrl = this.baseUrl + `/client/patch`;
  clientAdminUrl = this.baseUrl + `/client/admin`;

  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  public postClient(
    client: ClientPayload,
    updateApple: boolean
  ): Observable<any> {
    const url = `${this.clientPostUrl}?org_id=${client.orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .post<any>(
        url,
        {
          operation: "create",
          tableName: "clients_2",
          payload: client,
          updateApple,
        },
        { headers: headers }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public patchClient(
    client: ClientPayload,
    updateApple: boolean
  ): Observable<any> {
    const url = `${this.clientPatchUrl}?org_id=${client.orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    headers = headers.set("x-api-key", this.authKey);

    return this.http
      .post<any>(
        url,
        {
          client,
          updateApple,
        },
        { headers: headers }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public getClient(orgId: string): Observable<any> {
    const url = `${this.clientGetUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // public getClientCostHistory(
  //   orgId: string,
  //   pageSize: number
  // ): Observable<CostPerInstallDayObject[]> {
  //   const sort = "desc";
  //   const url = `${this.clientCostHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}&sort=${sort}`;
  //   let headers = new HttpHeaders();
  //   headers = headers.set("x-api-key", this.authKey);
  //   headers = headers.set("Authorization", this.userAccountservice.jwtToken);
  //   return this.http.get<any>(url, { headers: headers }).pipe(
  //     map((response) => {
  //       return CostPerInstallDayObject.buildFromGetHistoryResponse(response);
  //     })
  //   );
  // }

  public getClientCostHistoryByTime(
    orgId: string,
    pageSize: number,
    offsetKey: string,
    startDate: string,
    endDate: string
  ): Observable<[CostPerInstallDayObject[], CpiOffsetObject[], number]> {
    let offsetIndexComposite = offsetKey.split("|");
    const offsetOrgId = offsetIndexComposite[0];
    const offsetDate = offsetIndexComposite[1];
    const startDateParam = isNil(startDate) ? "all" : startDate;
    const endDateParam = isNil(endDate) ? "all" : endDate;
    const url = `${this.clientCostHistoryUrl}?org_id=${orgId}&total_recs=${pageSize}&offsetOrgId=${offsetOrgId}&offsetDate=${offsetDate}&start_date=${endDateParam}&end_date=${startDateParam}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        // return CostPerInstallDayObject.buildFromGetHistoryResponse(response);
        return response;
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
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getClientCampaignHistory(
    orgId: string,
    campaignIds: string[],
    pageSize: number,
    offsetKey: string,
    startDate: string,
    endDate: string
  ): Observable<[any[], CampaignOffsetObject, number]> {
    let offsetIndexComposite = offsetKey.split("|");
    const offsetCampaignId = offsetIndexComposite[0];
    const offsetDate = offsetIndexComposite[1];

    let params = new HttpParams();
    params = reduce(campaignIds, (m, i) => m.append("campaign_id", i), params);

    if (!isNil(pageSize)) {
      params = params.append("total_recs", pageSize.toString());
    }

    params = params.append("offsetCampaignId", offsetCampaignId);
    params = params.append("offsetDate", offsetDate);
    params = params.append("start_date", startDate);
    params = params.append("end_date", endDate);
    params = params.append("org_id", orgId);

    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http
      .get<any>(this.clientCampaignHistoryUrl, { headers: headers, params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
