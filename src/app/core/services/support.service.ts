import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { SupportItem } from "src/app/features/support/models/support-item";

@Injectable({
  providedIn: "root",
})
export class SupportService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.baseUrl;
  supportPostUrl = this.baseUrl + `/support/post/`;
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  public postSupportItem(supportItem: SupportItem): Observable<any> {
    const url = `${this.supportPostUrl}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .post<any>(
        url,
        {
          payload: supportItem,
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
}
