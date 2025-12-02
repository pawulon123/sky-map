// svg-tooltip-root.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';
import { SvgTooltipService } from './tooltip.service';

@Directive({
  selector: '[appSvgTooltipRoot]',
})
export class SvgTooltipRootDirective {
  constructor(
    private el: ElementRef<SVGElement>,
    private tooltip: SvgTooltipService
  ) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const target = event.target as SVGElement | null;
    if (!target) return;

    // szukamy atrybutu na samym elemencie albo w górę po drzewie
    const elWithTooltip = this.findTooltipElement(target);
    if (!elWithTooltip) {
      this.tooltip.hide();
      return;
    }

    const text = elWithTooltip.getAttribute('data-tooltip');
    if (!text) {
      this.tooltip.hide();
      return;
    }

    // pozycja przy kursorze
    this.tooltip.show(event.clientX + 12, event.clientY + 12, text);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.tooltip.hide();
  }

  private findTooltipElement(start: SVGElement | null): SVGElement | null {
    let el: SVGElement | null = start;
    const root = this.el.nativeElement;

    while (el) {
      if (el.hasAttribute('data-tooltip')) {
        return el;
      }
      if (el === root) break;
      el = el.parentElement as SVGElement | null;
    }

    return null;
  }
}
