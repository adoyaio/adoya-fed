import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FIELD, FORM } from '../../models/injection-tokens';

@Component({
    selector: 'app-content-section',
    template: `
        <div class="tax-info-interview__certify-text">
            <b>Under Penalties of Law, I certify that:</b>
            <ol>
                <li>
                    The number shown on this form is my correct taxpayer identification number, and
                </li>
                <li>
                    I am not subject to backup withholding becasause (a) I am exempt from backup
                    withholding, or (b) I have not been notified by the Internal Revenue Serivce
                    (IRS) that I am subject to backup withholding as a result of a failure to report
                    all interest or dividens, (c) or the IRS has notified me that I am nolonger
                    subject to backup withholding, and
                </li>
                <li>
                    I am (a) a U.S. citizen, or (b) a partnership, corporation/company/association
                    created or organized in the United States or under the laws of the United
                    States, or (c) an estate (other than a foreign estate), or (d) a U.S. domestic
                    trust.
                </li>
                <li>
                    The FACTA code(s) entered on this form (if any) indicating that I am exempt from
                    FACTA reporting is correct (JTV as a US withholding agent does not request this
                    information for the type of payment received).
                </li>
            </ol>
            <b>
                The IRS does not require your consent to any provisions of this document other than
                the certification required to avoid backup withholding.
            </b>
            <b>Certification Instructions: </b> You must cross out item 2 above if you have been
            notified by the IRS that you ar4 currently subject to backup withholding. You will need
            to print out your hard copy form at the end of the interview and cross out item 2 before
            signing and mail to the address provided.
        </div>
    `,
    styles: []
})
export class ContentSectionComponent implements OnInit {
    field: any;
    form: any;
    inClassName = '';
    constructor(
        @Inject(FIELD) private fieldInjected: Injector,
        @Inject(FORM) private formInjected: Injector
    ) {
        this.field = this.fieldInjected;
        this.form = this.formInjected;
    }

    ngOnInit() {
        this.inClassName = this.field.label;
    }
}
