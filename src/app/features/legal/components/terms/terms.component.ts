import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.scss"],
})
export class TermsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  text = AppService.termsOfService;
}
