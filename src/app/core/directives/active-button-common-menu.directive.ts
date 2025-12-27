import { Directive, ElementRef, Input, Renderer2, effect, inject } from '@angular/core';
import { EventCommonMenu, ZoomMode } from '../common/event-common-menu';
import { CommonMenuService } from '../../common-menu/common-menu.service';

@Directive({
  selector: '[appActiveMenuButton]',
  standalone: true,
})
export class ActiveMenuButtonDirective {
  private readonly menu = inject(CommonMenuService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly r = inject(Renderer2);

  @Input('appActiveMenuButton') name!: EventCommonMenu['name'];

  @Input() zoomMode?: ZoomMode;

  @Input() activeBg = '#1976d2';
  @Input() inactiveBg = 'transparent';
  @Input() activeText = '#ffffff';
  @Input() inactiveText = 'inherit';
  ignorNames = ['fitToWindow'];

  constructor() {
    effect(() => {
      const ev = this.menu.ev();
      if (this.ignorNames.includes(ev.name)) return;

      const activeByName = ev?.name === this.name;
      const activeByMode = this.name !== 'toggleZoom' || !this.zoomMode || (ev as any)?.zoomMode === this.zoomMode;

      const isActive = !!activeByName && !!activeByMode;

      this.r.setStyle(this.el.nativeElement, 'background-color', isActive ? this.activeBg : this.inactiveBg);
      this.r.setStyle(this.el.nativeElement, 'color', isActive ? this.activeText : this.inactiveText);

      //   if (isActive) this.r.addClass(this.el.nativeElement, 'is-active');
      //   else this.r.removeClass(this.el.nativeElement, 'is-active');
    });
  }
}
