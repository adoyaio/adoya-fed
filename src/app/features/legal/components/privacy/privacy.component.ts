import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.component.html",
  styleUrls: ["./privacy.component.scss"],
})
export class PrivacyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  text = AppService.privacyPolicy;
}
