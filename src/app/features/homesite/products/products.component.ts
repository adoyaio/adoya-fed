import { Component, OnInit } from "@angular/core";
import { HomesiteFacade } from "../facades/homesite.facade";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  constructor(public homesiteFacade: HomesiteFacade) {}

  ngOnInit() {}
}
