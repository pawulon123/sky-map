import { SvgData } from '../../core/common/svg-data';
import { SVG_TO_MM, svgToMm } from '../../core/utils/utils-function';
import { SvgExportOptions } from '../../features/sky-map/modals/svg-export-dialog/svg-export-dialog.component';

export function exportSvg(
  { width, height }: SvgData,
  nativeElement: SVGSVGElement | null,
  options: SvgExportOptions = { truncateMm: false }
): void {
  if (!nativeElement || !width || !height) return;

  // Klonujemy SVG
  const clone = nativeElement.cloneNode(true) as SVGSVGElement;

  clone.removeAttribute('ng-reflect-ng-if');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const mmWidth = svgToMm(width);
  const mmHeight = svgToMm(height)

  clone.setAttribute('width', `${mmWidth}mm`);
  clone.setAttribute('height', `${mmHeight}mm`);

  // Opcjonalne zaokrąglanie średnic okręgów w górę
  if (options.truncateMm) {
    const circles = clone.querySelectorAll('circle[r]');


    circles.forEach((circle) => {
      const radiusSvg = Number(circle.getAttribute('r'));

      if (!Number.isFinite(radiusSvg) || radiusSvg <= 0) return;

      // Promień SVG → średnica w mm
      const diameterMm = radiusSvg * 2 * SVG_TO_MM;

      // Zaokrąglenie średnicy w górę do pełnych mm
      const roundedDiameterMm = Math.ceil(diameterMm);

      // Średnica w mm → promień SVG
      const newRadiusSvg = roundedDiameterMm / (2 * SVG_TO_MM);

      circle.setAttribute('r', String(newRadiusSvg));
    });
  }

  // Serializacja SVG
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  if (!source.startsWith('<?xml')) {
    source = '<?xml version="1.0" encoding="UTF-8"?>\n' + source;
  }

  // Pobranie pliku
  const blob = new Blob([source], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'skymap-engraving.svg';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
