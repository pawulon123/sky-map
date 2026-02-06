export interface RenderSettings {
  innerWidth: number;
  innerHeight: number;
}
export type eventsFromCommonMenu = 'fitToWindow' | 'move' | 'toggleZoom';

export type ZoomMode = 'in' | 'out' | 'none';
export type FitToWindow = 'fit';

export interface EventCommonMenu extends RenderSettings {
  name?: eventsFromCommonMenu;
  zoomMode?: ZoomMode;
  fitToWindow?: FitToWindow;
}
