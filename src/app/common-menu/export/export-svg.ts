import { SvgData } from '../../core/common/svg-data';

export function exportSvg({ width, height }: SvgData, nativeElement: SVGSVGElement | null) {
  const svgEl = nativeElement;
  if (!svgEl || !width || !height) return;

  // sklonuj SVG, żeby nie grzebać w żywym DOM
  const clone = svgEl.cloneNode(true) as SVGSVGElement;

  // upewniamy się, że są sensowne atrybuty (dla programów od grawerki)
  clone.removeAttribute('ng-reflect-ng-if'); // jakby coś leciało z Angulara
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  // opcjonalnie: ustaw rozmiar w mm (wiele grawerek lubi mm)
  // np. 1px = 0.264583 mm (96 dpi), możesz dopasować do swojego workflow
  const mmWidth = width * 0.264583;
  const mmHeight = height * 0.264583;
  clone.setAttribute('width', `${mmWidth}mm`);
  clone.setAttribute('height', `${mmHeight}mm`);

  // serializacja do stringa
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  // nagłówek XML (część programów tego wymaga)
  if (!source.startsWith('<?xml')) {
    source = '<?xml version="1.0" encoding="UTF-8"?>\n' + source;
  }

  // utwórz Blob i ściągnij plik
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'skymap-engraving.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
