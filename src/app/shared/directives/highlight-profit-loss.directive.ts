import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightProfitLoss]',
  standalone: true,
})
export class HighlightProfitLossDirective implements AfterViewInit, OnChanges {
  @Input({ required: true }) innerText!: string | null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.setAnimation();
  }

  ngOnChanges() {
    this.setAppearance();
  }

  private setAppearance() {
    if (this.innerText?.startsWith('-')) {
      this.setLossStyles();
    } else {
      this.setProfitStyles();
    }
  }

  private setAnimation() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'color');
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', '.3s ease-out');
  }

  private setLossStyles() {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', `${this.innerText}`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#F04832');
  }

  private setProfitStyles() {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', `+${this.innerText}`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#21C187');
  }
}
