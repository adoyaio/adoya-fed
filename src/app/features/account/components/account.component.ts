import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  constructor(private amplifyService: AmplifyService) {}

  ngOnInit() {}
}
