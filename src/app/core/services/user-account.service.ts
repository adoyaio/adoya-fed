import { Auth } from "aws-amplify";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { UserAccount } from "../../shared/models/user-account";
import { AmplifyService } from "aws-amplify-angular";
import { isNil } from "lodash";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserAccountService {
  private storedUser: UserAccount = new UserAccount();
  private currentUserSubject: BehaviorSubject<UserAccount> =
    new BehaviorSubject<UserAccount>(this.storedUser);
  public currentUser$: Observable<UserAccount>;

  public jwtToken: string;
  public orgId: string;
  public userName: string;
  public agentId = undefined;
  public isAgent = false;
  public browsingAsString = undefined;

  constructor(public amplifyService: AmplifyService, private router: Router) {
    // this.currentUserSubject = new BehaviorSubject<UserAccount>(this.storedUser);
    // this.currentUser$ = this.currentUserSubject.asObservable();

    // reset agent values from local storage
    this.browsingAsString = localStorage.getItem("browsingAsString");
  }

  public get currentUserValue(): UserAccount {
    return this.currentUserSubject.value;
  }

  // deprecated use amplify lbi
  getCurrentUser(): UserAccount {
    let userAccount = new UserAccount();
    const keys = Object.keys(localStorage);
    const regexp: RegExp = /CognitoIdentityServiceProvider.*userData/;

    const userDataKey = keys.find((key) => {
      if (key.match(regexp)) {
        return true;
      }
    });
    const user: string = localStorage.getItem(userDataKey);
    userAccount = JSON.parse(user);
    return userAccount;
  }

  setCurrentUser(userAccount: UserAccount) {
    this.storedUser = userAccount;
    this.currentUserSubject.next(userAccount);
    this.currentUser$ = of(userAccount);
  }

  logout() {
    Auth.signOut().then((val) => {
      this.clearStorage();
    });
  }

  clearStorage() {
    // localStorage.clear();
    this.storedUser = null;
    this.currentUserSubject.next(null);
  }

  contextSwitch(clientOrgId, appName) {
    this.orgId = clientOrgId;
    this.browsingAsString = appName;
    localStorage.setItem("browsingAsString", appName);
    localStorage.setItem("orgId", clientOrgId);
    this.router.navigateByUrl("/workbench/optimizations");
  }
}
