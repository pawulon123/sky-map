export type eventsFromCommonMenu = 'fitToWindow' | 'resetToRealSize' | 'toggleZoom';

export type ZoomMode = 'in' | 'out' | 'none';

export interface EventCommonMenu {
  name: eventsFromCommonMenu;
  zoomMode?: ZoomMode;
  innerWidth?: number;
  innerHeight?: number;
}
