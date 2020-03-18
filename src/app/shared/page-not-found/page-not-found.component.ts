import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {
    errorCodeHeader = '404';
    errorCardHeaderMessaging = 'Doggone it!';
    errorMessaging =
        'Please go back and try again, or call our customer service representatives toll-free for immediate assistance at 1-800-581-3002.';
    userFriendlySuggestedActionMessage = "The page you're looking for can't be found.";

    imgSrc = 'https://images.jtv.com/media/partner-central/error/error-404.jpg';

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {}
}
