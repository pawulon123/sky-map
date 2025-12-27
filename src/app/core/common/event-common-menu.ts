export type eventsFromCommonMenu = 'fitToWindow' | 'resetToRealSize' | 'toggleZoom';

export type ZoomMode = 'in' | 'out' | 'none';
export type FitToWindow = 'fit' | 'resetToRealSize';

export interface EventCommonMenu {
  name: eventsFromCommonMenu;
  zoomMode?: ZoomMode;
  innerWidth?: number;
  innerHeight?: number;
  fitToWindow?: FitToWindow;
}
