import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { get as _get } from "lodash";
import {
  CampaignData,
  CampaignUpdateData,
} from "src/app/features/registration/model/campaign-data";
import { UserAccountService } from "./user-account.service";

@Injectable({
  providedIn: "root",
})
export class AppleService {
  constructor(
    private http: HttpClient,
    private userAccountservice: UserAccountService
  ) {}
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  baseUrl = environment.baseUrl;
  getAppleAppsUrl = this.baseUrl + `/apple/apps`;
  getAppleAclsUrl = this.baseUrl + `/apple/acls`;
  getAppleAuthUrl = this.baseUrl + `/apple/auth`;
  createAppleCampaignsUrl = this.baseUrl + `/apple/campaign/post`;
  updateAppleCampaignsUrl = this.baseUrl + `/apple/campaign/patch`;

  public getAppleApps(orgId: string): Observable<any> {
    const url = `${this.getAppleAppsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getAppleAcls(orgId: string): Observable<any> {
    const url = `${this.getAppleAclsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getAppleAuth(orgId: string): Observable<any> {
    const url = `${this.getAppleAuthUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public postAppleCampaign(
    orgId: string,
    campaignData: CampaignData
  ): Observable<any> {
    const url = `${this.createAppleCampaignsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.post<any>(url, campaignData, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public patchAppleCampaign(
    orgId: string,
    updateData: Array<CampaignUpdateData>
  ): Observable<any> {
    const url = `${this.updateAppleCampaignsUrl}?org_id=${orgId}`;
    debugger;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    headers = headers.set("Authorization", this.userAccountservice.jwtToken);
    return this.http.patch<any>(url, updateData, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
