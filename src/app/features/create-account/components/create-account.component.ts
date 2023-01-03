import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { MatSnackBar, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { AppleService } from "src/app/core/services/apple.service";
import { ClientService } from "src/app/core/services/client.service";
import { SupportService } from "src/app/core/services/support.service";
import { UserAccountService } from "src/app/core/services/user-account.service";
import { Auth } from "aws-amplify";
import { get, isNil } from "lodash";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent implements OnInit, AfterViewInit {
  ngOnInit() {
    this.userAccountService.amplifyService
      .authState()
      .pipe(
        tap((authState) => {
          if (authState.state == "signedIn") {
            this.view = "logout";
          }
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.confirmPasswordControl.valueChanges
      .pipe(
        tap((value) => {
          if (value !== this.passwordControl.value) {
            this.confirmPasswordControl.setErrors({ notmatching: true });
            return;
          } else {
            this.confirmPasswordControl.setErrors(null);
          }
        })
      )
      .subscribe();

    this.confirmPasswordControlConfirmReset.valueChanges
      .pipe(
        filter((value) => !isNil(value)),
        tap((value) => {
          if (value !== this.passwordControlConfirmReset.value) {
            this.confirmPasswordControlConfirmReset.setErrors({
              notmatching: true,
            });
            return;
          } else {
            this.confirmPasswordControlConfirmReset.setErrors(null);
          }
        })
      )
      .subscribe();
  }

  form = this.fb.group({
    email: new FormControl("", Validators.required),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("[a-zA-Z]+[0-9]+"),
    ]),
    confirmpassword: new FormControl("", [Validators.required]),
    first: new FormControl(""),
    last: new FormControl(""),
  });

  loginForm = this.fb.group({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  confirmForm = this.fb.group({
    email: new FormControl("", Validators.required),
    code: new FormControl("", Validators.required),
  });

  resetForm = this.fb.group({
    email: new FormControl("", Validators.required),
  });

  confirmResetForm = this.fb.group({
    email: new FormControl("", Validators.required),
    code: new FormControl("", Validators.required),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("[a-zA-Z]+[0-9]+"),
    ]),
    confirmpassword: new FormControl("", [Validators.required]),
  });

  isSendingResults;

  public view;
  public user;

  get passwordControl(): AbstractControl {
    return this.form.get("password");
  }

  get confirmPasswordControl(): AbstractControl {
    return this.form.get("confirmpassword");
  }

  get passwordControlConfirmReset(): AbstractControl {
    return this.confirmResetForm.get("password");
  }

  get confirmPasswordControlConfirmReset(): AbstractControl {
    return this.confirmResetForm.get("confirmpassword");
  }

  get loginEmailControl(): AbstractControl {
    return this.loginForm.get("email");
  }

  get loginPasswordControl(): AbstractControl {
    return this.loginForm.get("password");
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    private appleService: AppleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public userAccountService: UserAccountService,
    private supportService: SupportService
  ) {
    if (!isNil(this.userAccountService.jwtToken)) {
      this.view = "logout";
    } else {
      this.view = "login";
    }
  }

  passwordError(formName: string): string {
    const control =
      formName === "form"
        ? this.passwordControl
        : this.passwordControlConfirmReset;
    if (isNil(control)) {
      return "";
    }

    if (isNil(control)) {
      return "";
    }

    if (control.getError("minlength")) {
      return "Password must be minimum of 8 characters";
    }

    if (control.getError("pattern")) {
      return "Password must contain letters and numbers.";
    }
  }

  confirmationError(formName: string): string {
    const control =
      formName === "form"
        ? this.confirmPasswordControl
        : this.confirmPasswordControlConfirmReset;
    if (isNil(control)) {
      return "";
    }

    if (control.getError("notmatching")) {
      return "Passwords must match";
    }
  }

  handleSignOut() {
    Auth.signOut().then(() => {
      this.view = "login";
      this.userAccountService.logout();
    });
  }

  handleSignIn() {
    this.isSendingResults = true;
    Auth.signIn(this.loginEmailControl.value, this.loginPasswordControl.value)
      .then((user) => {
        const un = get(user, "attributes.email");
        this.isSendingResults = false;
        this.openSnackBar(`welcome, ${un} :)`, "dismiss");
        this.userAccountService.amplifyService.setAuthState({
          state: "signedIn",
          user,
        });

        this.router.navigateByUrl("/workbench");
      })
      .catch((err) => {
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
  }

  handleSignUp() {
    this.isSendingResults = true;
    Auth.signUp({
      username: this.form.get("email").value,
      password: this.form.get("password").value,
      // attributes: {
      //     first_name,          // optional
      //     phone_number,   // optional - E.164 number convention
      //     // other custom attributes
      // },
      //autoSignIn: {
      // optional - enables auto sign in after user is confirmed
      //  enabled: true,
      //},
    })
      .then((user) => {
        //console.log(user);
        this.confirmForm.get("email").setValue(this.form.get("email").value);
        this.showView("confirm");
        this.isSendingResults = false;
      })
      .catch((err) => {
        console.log(get(err, "message"));
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
  }

  handleConfirm() {
    this.isSendingResults = true;
    const username = this.confirmForm.get("email").value;
    const code = this.confirmForm.get("code").value;
    Auth.confirmSignUp(username, code)
      .then(() => {
        this.showView("login");
        this.isSendingResults = false;
      })
      .catch((err) => {
        console.log(get(err, "message"));
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
  }

  handleResetSubmit() {
    this.isSendingResults = true;
    Auth.forgotPassword(this.resetForm.get("email").value)
      .then(() => {
        this.isSendingResults = false;
        this.confirmResetForm
          .get("email")
          .setValue(this.resetForm.get("email").value);
        this.view = "confirmreset";
      })
      .catch((err) => {
        console.log(get(err, "message"));
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
  }

  handleConfirmResetSubmit() {
    this.isSendingResults = true;
    Auth.forgotPasswordSubmit(
      this.confirmResetForm.get("email").value,
      this.confirmResetForm.get("code").value,
      this.confirmResetForm.get("password").value
    )
      .then(() => {
        this.isSendingResults = false;
        this.view = "login";
      })
      .catch((err) => {
        console.log(get(err, "message"));
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 15000,
      panelClass: "standard",
    });
  }

  signUpDisabled() {
    return (
      this.form.invalid ||
      this.isSendingResults ||
      this.confirmPasswordControl.value !== this.passwordControl.value
    );
  }

  showView(view: string) {
    // if (view == "reset") {
    //   this.userAccountService.amplifyService.setAuthState({
    //     state: "forgotPassword",
    //     user: {},
    //   });
    // }
    this.view = view;
  }
}
