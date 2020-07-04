import { UserAttributes } from "../../shared/models/user-account";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { UserAccount } from "../../shared/models/user-account";
import { AmplifyService } from "aws-amplify-angular";

@Injectable({
  providedIn: "root",
})
export class UserAccountService {
  private storedUser: UserAccount;
  private currentUserSubject: BehaviorSubject<UserAccount>;
  public currentUser$: Observable<UserAccount>;

  constructor(private amplifyService: AmplifyService) {
    this.currentUserSubject = new BehaviorSubject<UserAccount>(this.storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserAccount {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): UserAccount {
    // const user: string = localStorage.getItem(
    //   "CognitoIdentityServiceProvider.3cokktgqcs0o8oem003hotfjl7.9cde3279-ae17-44e5-b327-a0e4b2f0417e.userData"
    // );
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
  }

  logout() {
    this.clearStorage();
  }

  clearStorage() {
    localStorage.clear();
    this.storedUser = null;
    this.currentUserSubject.next(null);
  }
}
