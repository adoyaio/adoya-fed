import { Component } from '@angular/core';

@Component({
    selector: 'app-my-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    today: number = Date.now();

    constructor() {}
}
