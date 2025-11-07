import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, input, OnInit } from '@angular/core';
import { Star } from '../../../domain/models/star.model';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { LabelsLayerComponent } from '../labels-layer/labels-layer.component';
import { ProjectionService } from '../../../domain/services/projection/projection.service';

@Component({
  selector: 'g[app-stars-layer]',
  imports: [CommonModule, LabelsLayerComponent],
  templateUrl: './stars-layer.component.html',
  styleUrl: './stars-layer.component.css'
})
export class StarsLayerComponent implements OnInit{

  private svc  = inject(StarsService);


  ngOnInit(): void {
this.svc.loadOnce();

  }

  // show        = input<boolean>(true);
  maxMag      = input<number | null>(null);
  showLabels  = input<boolean>(true);
  labelMaxMag = input<number>(2.0);
  
@Input() showStars = true
  // dane gotowe do rysowania (po reprojectStars w AppComponent)
  stars = computed<Star[]>(() => {
    const all = this.svc.data().stars ?? [];
   
    // pokazuj tylko gwiazdy które mają wyliczone __projected = [x,y]
    let visible = all.filter(s => Array.isArray(s.__projected));
 
    const limit = this.maxMag();
    if (limit != null) {
      visible = visible.filter(s => s.mag == null || s.mag <= limit);
    }

    // sort wg jasności
    // console.log([...visible].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99)));
    
    return [...visible].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });

  radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  starCx(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[0];
  }

  starCy(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1];
  }

}
