import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "app-clickwrap",
  templateUrl: "./clickwrap.component.html",
  styleUrls: ["./clickwrap.component.scss"],
})
export class ClickwrapComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  text = AppService.clickWrap;
}
