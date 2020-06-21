import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appUpperCase]',
})
export class UppercaseDirective {

  constructor(public ref: ElementRef) {
  }

  @Input('appUpperCase') allowUpperCase: boolean;

  static convertToUpper(value: any) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  @HostListener('input') toUpperCase() {
    if (this.allowUpperCase) {
      this.ref.nativeElement.value = UppercaseDirective.convertToUpper(this.ref.nativeElement.value);
    }
  }
}
