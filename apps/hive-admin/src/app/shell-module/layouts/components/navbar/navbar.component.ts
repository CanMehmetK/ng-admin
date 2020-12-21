import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  // Private
  _variant: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // Set the private defaults
    this._variant = 'vertical-style-1';
  }

  get variant(): string {
    return this._variant;
  }

  @Input()
  set variant(value: string) {
    // Remove the old class name
    this.renderer.removeClass(this.elementRef.nativeElement, this.variant);

    // Store the variant value
    this._variant = value;

    // Add the new class name
    this.renderer.addClass(this.elementRef.nativeElement, value);
  }
}
