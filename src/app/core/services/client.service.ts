import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { CostPerInstallDayObject } from "src/app/features/reporting/models/cost-per-install-day-object";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  constructor(private http: HttpClient) {}

  gatewayPartnerUrl = `/api/client/history`;

  public getClientHistory(
    orgId: string
  ): Observable<CostPerInstallDayObject[]> {
    const url = `${this.gatewayPartnerUrl}?org_id=${orgId}&start_date=2020-06-12&end_date=2020-06-01`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log("getClientHistory");
        const retVal = CostPerInstallDayObject.buildFromGetHistoryResponse(
          response
        );
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error(error.message);
      })
    );
  }
}
