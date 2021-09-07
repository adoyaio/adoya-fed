import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { SupportService } from "src/app/core/services/support.service";
import { SupportItem } from "../../support/models/support-item";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private snackBar: MatSnackBar
  ) {}

  supportForm = this.fb.group({
    subject: [""],
    description: [""],
    username: [""],
    orgId: [""],
  });

  supportItem: SupportItem = new SupportItem();
  isLoadingResults = true;
  isSendingResults;
  orgId: string;
  subject: string;
  username: string;
  today: Date;

  ngOnInit() {}

  onSubmit() {}
}
