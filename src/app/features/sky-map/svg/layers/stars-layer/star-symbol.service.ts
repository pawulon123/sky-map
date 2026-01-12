import { computed, inject, Injectable, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { Star } from '../../../domain/models/star.model';
import { RenderStar } from '../../../domain/models/stars-layer-settings.model';
import { createRadius, getPropBaseRadius } from '../../../common/star-symbol-helper';

@Injectable({
  providedIn: 'root',
})
export class StarSymbolService {
  private svc = inject(StarsService);
  private state = inject(SkyMapStateService);

  private readonly settingsSig = toSignal(this.state.starsLayerSettings$, {
    initialValue: defaultStarsSettings,
  });

  readonly starSynbols = computed<RenderStar[]>(() => {
    const settings = this.settingsSig();
    const sym = settings.symbols;

         if(!sym.visible){
      return[]
     }else{

       return this.visibleStars().map((star) => {
         const [cx, cy] = star.__projected ?? [0, 0];
         const mag = star.mag ?? null;
   
         const r = createRadius(star, sym);
         const propsBaseRadis = getPropBaseRadius(r, sym);
         return {
           star,
           cx,
           cy,
           mag,
           shape: sym.shape,
           r,
           polygonPoints: '',
           customTransform: '',
           ...propsBaseRadis,
         };
       });
     }

  });

  private readonly visibleStars = computed<Star[]>(() => {
    const symbolSettings = this.settingsSig().symbols;
       const all = this.svc.data().stars ?? [];
       let visible = all.filter((s) => Array.isArray(s.__projected));
       const filteredMag = visible.filter(({ mag }) => symbolSettings.magMax >= mag);
   
       const selectedConstelation = this.state.getProjectionSettings().selected;
   
       const finelyStars = filteredMag.filter(({ con }) => selectedConstelation?.includes(con));
   
       return [...finelyStars].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
     
  });
}
