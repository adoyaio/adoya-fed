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
import { tap } from "rxjs/operators";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent implements OnInit, AfterViewInit {
  ngOnInit() {}

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

  isSendingResults;

  public view = "login";

  get passwordControl(): AbstractControl {
    return this.form.get("password");
  }

  get confirmPasswordControl(): AbstractControl {
    return this.form.get("confirmpassword");
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
    private userAccountService: UserAccountService,
    private supportService: SupportService
  ) {}

  get passwordError(): string {
    if (isNil(this.passwordControl)) {
      return "";
    }

    if (this.passwordControl.getError("minlength")) {
      return "Password must be minimum of 8 characters";
    }

    if (this.passwordControl.getError("pattern")) {
      return "Password must contain letters and numbers.";
    }
  }

  get confirmationError(): string {
    if (isNil(this.confirmPasswordControl)) {
      return "";
    }

    if (this.confirmPasswordControl.getError("notmatching")) {
      return "Passwords must match";
    }
  }

  handleSignIn() {
    this.isSendingResults = true;
    Auth.signIn(this.loginEmailControl.value, this.loginPasswordControl.value)
      .then((user) => {
        this.isSendingResults = false;
        this.openSnackBar("success", "dismiss");
        console.log(user);
        // if (get(user, "attributes.email_verified") === true) {
        //   this.userAccountService.amplifyService.setAuthState({
        //     state: "signedIn",
        //     user,
        //   });
        // }

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

  handleSubmit() {
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
        console.log(user);
        this.isSendingResults = false;
      })
      .catch((err) => {
        //console.log(get(err, "message"));
        this.isSendingResults = false;
        this.openSnackBar(get(err, "message", "error"), "dismiss");
      });
    // console.log(user);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 15000,
      panelClass: "standard",
    });
  }

  submitDisabled() {
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
