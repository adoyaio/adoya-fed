import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-workbench",
  templateUrl: "./workbench.component.html",
  styleUrls: ["./workbench.component.scss"]
})
export class WorkbenchComponent implements OnInit {
  constructor(private amplifyService: AmplifyService, private router: Router) {}

  ngOnInit() {
    this.amplifyService
      .authState()
      .pipe(
        tap(authState => {
          if (!(authState.state === "signedIn")) {
            this.router.navigateByUrl("/portal");
          }
        })
      )
      .subscribe();
  }
}
