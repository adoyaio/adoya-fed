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
  private currentUserSubject: BehaviorSubject<
    UserAccount
  > = new BehaviorSubject<UserAccount>(this.storedUser);
  public currentUser$: Observable<UserAccount>;

  // signedIn: boolean = false;

  constructor(private amplifyService: AmplifyService) {
    this.currentUserSubject = new BehaviorSubject<UserAccount>(this.storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserAccount {
    return this.currentUserSubject.value;
  }

  // setSignedInState(_signedIn) {
  //   console.log("set signed in state:::" + this.signedIn);
  //   this.signedIn = _signedIn;
  //   const user: UserAccount = this.getCurrentUser();
  //   this.setCurrentUser(user);
  // }

  // getSignedInState() {
  //   if (this.currentUserSubject.getValue()) {
  //     this.setSignedInState(true);
  //   }
  //   this.setSignedInState(false);

  //   return this.signedIn;
  // }

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
    // this.signedIn = false;
    this.clearStorage();
  }

  clearStorage() {
    localStorage.clear();
    this.storedUser = null;
    this.currentUserSubject.next(null);
  }
}
