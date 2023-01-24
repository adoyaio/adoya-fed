import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  text = AppService.faqs;
}
