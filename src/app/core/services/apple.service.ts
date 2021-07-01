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
import { CampaignData } from "src/app/features/registration/model/campaign-data";

@Injectable({
  providedIn: "root",
})
export class AppleService {
  constructor(private http: HttpClient) {}
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  baseUrl = environment.baseUrl;
  getAppleAppsUrl = this.baseUrl + `/apple/apps`;
  getAppleAclsUrl = this.baseUrl + `/apple/acls`;
  createAppleCampaignsUrl = this.baseUrl + `/apple/campaign`;

  public getAppleApps(orgId: string): Observable<any> {
    const url = `${this.getAppleAppsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
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
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public postAppleCampaign(orgId: string, campaignData: CampaignData): Observable<any> {
    const url = `${this.createAppleCampaignsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .post<any>(
        url,
        campaignData,
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
}
