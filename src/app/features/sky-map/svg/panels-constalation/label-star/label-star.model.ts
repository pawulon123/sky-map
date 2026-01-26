import { Star } from "../../../domain/models/star.model";


export interface PanelLabelBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PanelLeaderLine {
  // prosta łamana: [ [x,y], [x,y], ... ]
  points: [number, number][];
}

export interface PanelLabelPlacement {
  panelId: string;
  star: Star;

  // pozycja lewego-górnego rogu ramki tekstu w układzie SVG (global)
  x: number;
  y: number;

  // wymiary ramki (do kolizji i ewentualnego debug)
  box: PanelLabelBox;

  // linie tekstu
  lines: string[];

  // opcjonalnie: leader line
  leader?: PanelLeaderLine;
  leaderPointsAttr?: string;
}
