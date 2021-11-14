import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-homesite-partners",
  templateUrl: "./homesite-partners.component.html",
  styleUrls: ["./homesite-partners.component.scss"],
})
export class HomesitePartnersComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  handleClick(endpoint: string) {
    window.open(endpoint, "_blank");
  }
}
