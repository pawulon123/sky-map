import { inject, Injectable } from '@angular/core';

import { ProjectionService } from '../projection/projection.service';
import { SkyMapStateService } from '../sky-map-state/sky-map-state.service';

@Injectable({
  providedIn: 'root'
})
export class PredefinedService {
     private state = inject(SkyMapStateService);
     private projectionService = inject(ProjectionService);

  readonly predefined = [
  {
    value: 'pnels400x750',
    label: 'Panele 400x750',
    run:()=>{
        this.projectionService.setSettings(
          {
          panelSize: {
            w: 1512,
            h: 2835,
        }});
         this.state.updateStarsSymbols({
          minDiameterMm: 3,
          size: 20,
      })
    },

  
   
  },
  {
    value: 'pnels200x300',
    label: 'Panele 200x300',
     run:()=>{
        this.projectionService.setSettings(
          {
          panelSize: {
            w: 1000,
            h: 2000,
        }});
         this.state.updateStarsSymbols({
          minDiameterMm: 0,
          size: 10,
      })
    },

  },
];



}
