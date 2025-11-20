import { ProjectionName } from './projection-options.model';

export type StarSymbolShape = 'circle' | 'cross' | 'square' | 'icon';
export type StarLabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface StarsSymbolsSettings {
  /** Czy w ogóle rysować gwiazdy (markery) */
  visible: boolean;

  /** Kształt symbolu gwiazdy */
  shape: StarSymbolShape;

  /** Bazowy rozmiar (np. promień kółka) w jednostkach SVG */
  size: number;

  /** Kolor wypełnienia symbolu */
  color: string;

  /** Grubość obramowania */
  strokeWidth: number;

  /** Kolor obramowania symbolu */
  strokeColor: string;

  /** Czy skalować rozmiar symbolu na podstawie magnitudo */
  scaleByMagnitude: boolean;
}

export interface StarsLabelsSettings {
  /** Czy wyświetlać etykiety gwiazd */
  visible: boolean;
  magnitudeRange: [number, number];

  /** Położenie etykiety względem symbolu */
  position: StarLabelPosition;

  /** Rozmiar czcionki w px */
  fontSize: number;

  /** Maksymalna liczba linii tekstu */
  maxLines: number;

  /** Czy pokazywać ikonę przy etykiecie */
  iconEnabled: boolean;

  /** Czy rysować obramowanie wokół etykiety */
  borderEnabled: boolean;

  /** Kolor obramowania etykiety */
  borderColor: string;

  /** Kolor tekstu etykiety */
  textColor: string;

  /** Kolor tła etykiety */
  backgroundColor: string;
}

/**
 * Główne ustawienia warstwy gwiazd – łączy ustawienia symboli i etykiet.
 */
export interface StarsLayerSettings {
  symbols: StarsSymbolsSettings;
  labels: StarsLabelsSettings;
}
export type StarKey = 'symbols' | 'labels';
