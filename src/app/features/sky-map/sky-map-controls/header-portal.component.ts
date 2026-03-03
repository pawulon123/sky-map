import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { PanelHeaderPortalService, HeaderKey } from './panel-header-portal.service';

@Component({
  selector: 'app-header-portal',
  standalone: true,
  imports: [PortalModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #tpl>
      <div
        (click)="$event.stopPropagation()"
        (mousedown)="$event.stopPropagation()"
        (mouseup)="$event.stopPropagation()"
        (touchstart)="$event.stopPropagation()"
        (keydown.space)="$event.stopPropagation()"
        (keydown.enter)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class HeaderPortalComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) key!: HeaderKey;

  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<any>;
  private portal!: TemplatePortal;

  constructor(
    private vcr: ViewContainerRef,
    private header: PanelHeaderPortalService
  ) {}

  ngAfterViewInit() {
    this.portal = new TemplatePortal(this.tpl, this.vcr);
    queueMicrotask(() => {
      this.header.register(this.key, this.portal);
    });
  }

  ngOnDestroy() {
    queueMicrotask(() => {
      this.header.unregister(this.key);
    });
  }
}
