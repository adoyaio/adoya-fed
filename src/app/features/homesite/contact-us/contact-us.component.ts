import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { catchError, map, tap } from "rxjs/operators";
import { SupportService } from "src/app/core/services/support.service";
import { ContactUsItem, SupportItem } from "../../support/models/support-item";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ContactUsComponent>
  ) {}

  supportForm = this.fb.group({
    subject: [""],
    description: [""],
    username: [""],
    orgId: [""],
  });

  emailItem: ContactUsItem = new ContactUsItem();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  subject: string;
  username: string;
  today: Date;

  ngOnInit() {
    this.today = new Date();
    this.subject =
      this.today.toLocaleDateString().toString() +
      " - contact us clicked (⌐■_■) ";
    this.supportForm.get("subject").setValue(this.subject);

    this.supportForm
      .get("username")
      .setValidators([
        Validators.minLength(1),
        Validators.required,
        Validators.email,
      ]);

    this.supportForm
      .get("description")
      .setValidators([Validators.minLength(1), Validators.required]);
  }

  onSupportSubmit() {
    this.isSendingResults = true;
    this.emailItem.description = this.supportForm.get("description").value;
    this.emailItem.username = this.supportForm.get("username").value;
    this.emailItem.subject = this.supportForm.get("subject").value;
    this.emailItem.orgId = this.supportForm.get("orgId").value;
    this.emailItem.type = "contact";

    this.supportService
      .postContactUsItem(this.emailItem)
      .pipe(
        tap(() => {
          this.isSendingResults = true;
        }),
        map((data) => {
          this.isSendingResults = false;

          this.openSnackBar("thank you for contacting adoya!");
          this.dialogRef.close();
          return data;
        }),
        catchError(() => {
          this.isSendingResults = false;
          this.openSnackBar(
            "we're having trouble contacting our server at this time, we apologize for any inconvenience. you can reach us via email at info@adoya.io"
          );
          this.dialogRef.close();
          return [];
        })
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "dismiss", {
      duration: 10000,
      panelClass: "standard",
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
