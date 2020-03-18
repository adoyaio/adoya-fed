import { NgModule } from '@angular/core';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
    imports: [
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDatepickerModule,
        MatDialogModule,
        MatNativeDateModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRadioModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatSortModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,
        MatGridListModule
    ],
    providers: [MatIconRegistry],
    exports: [
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDatepickerModule,
        MatDialogModule,
        MatNativeDateModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatSortModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatStepperModule,
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,
        MatGridListModule
    ]
})
export class MaterialModule {
    constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'user_account',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/user_account.svg')
        );
        iconRegistry.addSvgIcon(
            'user_account_blue',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/user_account_blue.svg')
        );
        iconRegistry.addSvgIcon(
            'icon_product_listings',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon_product_listings.svg')
        );
    }
}
