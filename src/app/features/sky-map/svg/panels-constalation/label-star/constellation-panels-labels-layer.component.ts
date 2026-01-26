import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { Star } from "../../../domain/models/star.model";
import { SkyMapStateService } from "../../../domain/services/sky-map-state/sky-map-state.service";
import { buildLabelLines, firstLine } from "../../layers/labels-layer/name-or-bayer";
import { ConstellationPanelLabelsService } from "./constellation-panel-labels.service";
import { PanelLabelPlacement } from "./label-star.model";
import { ConstellationPanelVM } from "../../../domain/models/panels.model";


@Component({
  selector: 'g[app-constellation-panels-labels-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './constellation-panels-labels-layer.component.html',
})
export class ConstellationPanelsLabelsLayerComponent implements OnInit {
  private svc = inject(ConstellationPanelLabelsService);
  private state = inject(SkyMapStateService);

  private labelLinesFn!: (star: Star) => string[];
@Input({ required: true }) panel!: ConstellationPanelVM;
  ngOnInit(): void {
    const getLabelsSetting = () => this.state.getStarSettings().labels;
    this.labelLinesFn = buildLabelLines(firstLine)(getLabelsSetting);
  }

  private getCache() {
    const cache = new Map<Star, string[]>();
    return (star: Star) => {
      const hit = cache.get(star);
      if (hit) return hit;
      const lines = this.labelLinesFn(star);
      cache.set(star, lines);
      return lines;
    };
  }

  compute(): PanelLabelPlacement[] {
    // const cached = this.getCache();
    // return this.svc.computePanelLabels(cached);
    const cached = this.getCache();
    return this.svc.computePanelLabelsForPanel(this.panel, cached,'panel');
  }
}
