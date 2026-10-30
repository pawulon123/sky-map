
import { Injectable } from '@angular/core';
import { SVG_TO_MM } from '../../core/utils/utils-function';

export interface DxfExportOptions {
  truncateMm: boolean;
}

type Point = {
  x: number;
  y: number;
};

@Injectable({ providedIn: 'root' })
export class DxfExportService {

  exportDxf(
    svgElement: SVGSVGElement,
    options: DxfExportOptions,
    width: number,
    height: number
  ): void {

    if (!svgElement || width <= 0 || height <= 0) {
      return;
    }

    const entities: string[] = [];

    // Macierz transformacji elementu względem głównego SVG.
    // Pomijamy skalowanie samego SVG wynikające z viewBox
    // i rozmiaru elementu na ekranie.
    const getElementMatrix = (element: Element): DOMMatrix => {

      const transforms: DOMMatrix[] = [];
      let current: Element | null = element;

      while (current && current !== svgElement) {

        if (current instanceof SVGGraphicsElement) {

          const localTransform =
            current.transform.baseVal.consolidate();

          if (localTransform) {
            transforms.unshift(
              DOMMatrix.fromMatrix(localTransform.matrix)
            );
          }
        }

        current = current.parentElement;
      }

      let matrix = new DOMMatrix();

      for (const transform of transforms) {
        matrix = matrix.multiply(transform);
      }

      return matrix;
    };

    // Pobieramy geometrię SVG
    const elements = svgElement.querySelectorAll(
      'circle, line, rect, polyline, polygon, path'
    );

    let circlesCount = 0;
    let linesCount = 0;
    let polylinesCount = 0;

    elements.forEach(element => {

      // Pomijamy elementy pomocnicze SVG
      if (
        element.closest(
          'defs, clipPath, mask, symbol, marker, pattern'
        )
      ) {
        return;
      }

      // Pomijamy ukryte elementy i grupy
      if (
        element.closest('[display="none"], [visibility="hidden"]')
      ) {
        return;
      }

      const matrix = getElementMatrix(element);

      // SVG -> milimetry DXF.
      // Odwrócenie osi Y pozwala zachować orientację.
      const transform = (x: number, y: number): Point => {

        const p = new DOMPoint(x, y)
          .matrixTransform(matrix);

        return {
          x: p.x * SVG_TO_MM,
          y: -p.y * SVG_TO_MM
        };
      };

      switch (element.tagName.toLowerCase()) {

        // ========================================
        // CIRCLE
        // ========================================
        case 'circle': {

          const circle = element as SVGCircleElement;

          const cx = circle.cx.baseVal.value;
          const cy = circle.cy.baseVal.value;
          const r = circle.r.baseVal.value;

          if (r <= 0) break;

          const center = transform(cx, cy);
          const px = transform(cx + r, cy);
          const py = transform(cx, cy + r);

          const rx = Math.hypot(
            px.x - center.x,
            px.y - center.y
          );

          const ry = Math.hypot(
            py.x - center.x,
            py.y - center.y
          );

          const dot =
            (px.x - center.x) * (py.x - center.x) +
            (px.y - center.y) * (py.y - center.y);

          // CIRCLE nie może reprezentować elipsy.
          if (
            Math.abs(rx - ry) > 0.0001 ||
            Math.abs(dot) > 0.0001 * rx * ry
          ) {
            console.warn(
              '[DXF] Pominięto okrąg z nierównomierną transformacją',
              circle
            );
            break;
          }

          // Średnica po uwzględnieniu transformacji
          const diameterMm = rx * 2;

          // Zaokrąglamy średnicę, nie promień
          const radius = options.truncateMm
            ? Math.ceil(diameterMm - 1e-9) / 2
            : rx;

          if (radius > 0) {
            entities.push(
              this.circle(center, radius)
            );

            circlesCount++;
          }

          break;
        }

        // ========================================
        // LINE
        // ========================================
        case 'line': {

          const line = element as SVGLineElement;

          const a = transform(
            line.x1.baseVal.value,
            line.y1.baseVal.value
          );

          const b = transform(
            line.x2.baseVal.value,
            line.y2.baseVal.value
          );

          entities.push(this.line(a, b));
          linesCount++;

          break;
        }

        // ========================================
        // RECT
        // ========================================
        case 'rect': {

          const rect = element as SVGRectElement;

          const x = rect.x.baseVal.value;
          const y = rect.y.baseVal.value;
          const w = rect.width.baseVal.value;
          const h = rect.height.baseVal.value;

          if (w <= 0 || h <= 0) break;

          if (
            rect.rx.baseVal.value > 0 ||
            rect.ry.baseVal.value > 0
          ) {
            console.warn(
              '[DXF] Pominięto zaokrąglony prostokąt',
              rect
            );
            break;
          }

          entities.push(
            this.polyline([
              transform(x, y),
              transform(x + w, y),
              transform(x + w, y + h),
              transform(x, y + h)
            ], true)
          );

          polylinesCount++;

          break;
        }

        // ========================================
        // POLYLINE / POLYGON
        // ========================================
        case 'polyline':
        case 'polygon': {

          const poly = element as SVGPolylineElement;

          const points = Array.from(poly.points)
            .map(p => transform(p.x, p.y));

          if (points.length < 2) break;

          const closed =
            element.tagName.toLowerCase() === 'polygon';

          entities.push(
            this.polyline(points, closed)
          );

          polylinesCount++;

          break;
        }

        // ========================================
        // PATH
        // ========================================
        case 'path': {

          const path = element as SVGPathElement;

          const length = path.getTotalLength();

          if (length <= 0) break;

          // Przybliżamy ścieżkę odcinkami.
          const segments = Math.max(
            2,
            Math.min(10000, Math.ceil(length))
          );

          const points: Point[] = [];

          for (let i = 0; i <= segments; i++) {

            const p = path.getPointAtLength(
              length * i / segments
            );

            points.push(
              transform(p.x, p.y)
            );
          }

          const closed = /[zZ]\s*$/.test(
            path.getAttribute('d') ?? ''
          );

          entities.push(
            this.polyline(points, closed)
          );

          polylinesCount++;

          break;
        }
      }
    });

    // ========================================
    // DXF R12
    // ========================================
    const dxf = [
      '0', 'SECTION',
      '2', 'HEADER',
      '9', '$ACADVER',
      '1', 'AC1009',
      '0', 'ENDSEC',

      '0', 'SECTION',
      '2', 'TABLES',
      '0', 'TABLE',
      '2', 'LAYER',
      '70', '1',
      '0', 'LAYER',
      '2', '0',
      '70', '0',
      '62', '7',
      '6', 'CONTINUOUS',
      '0', 'ENDTAB',
      '0', 'ENDSEC',

      '0', 'SECTION',
      '2', 'ENTITIES',

      ...entities,

      '0', 'ENDSEC',
      '0', 'EOF'
    ].join('\r\n');

    this.download(dxf, 'export.dxf');
  }

  // ========================================
  // DXF CIRCLE
  // ========================================
  private circle(center: Point, radius: number): string {
    return [
      '0', 'CIRCLE',
      '8', '0',
      '10', this.num(center.x),
      '20', this.num(center.y),
      '30', '0',
      '40', this.num(radius)
    ].join('\r\n');
  }

  // ========================================
  // DXF LINE
  // ========================================
  private line(a: Point, b: Point): string {
    return [
      '0', 'LINE',
      '8', '0',
      '10', this.num(a.x),
      '20', this.num(a.y),
      '30', '0',
      '11', this.num(b.x),
      '21', this.num(b.y),
      '31', '0'
    ].join('\r\n');
  }

  // ========================================
  // DXF R12 POLYLINE
  // ========================================
  private polyline(
    points: Point[],
    closed: boolean
  ): string {

    const result: string[] = [
      '0', 'POLYLINE',
      '8', '0',
      '66', '1',
      '10', '0',
      '20', '0',
      '30', '0',
      '70', closed ? '1' : '0'
    ];

    for (const p of points) {
      result.push(
        '0', 'VERTEX',
        '8', '0',
        '10', this.num(p.x),
        '20', this.num(p.y),
        '30', '0',
        '70', '0'
      );
    }

    result.push(
      '0', 'SEQEND',
      '8', '0'
    );

    return result.join('\r\n');
  }

  // ========================================
  // FORMAT LICZB
  // ========================================
  private num(value: number): string {

    if (!Number.isFinite(value)) {
      throw new Error('Nieprawidłowa współrzędna DXF');
    }

    return Number(value.toFixed(6)).toString();
  }

  // ========================================
  // DOWNLOAD
  // ========================================
  private download(
    content: string,
    filename: string
  ): void {

    const blob = new Blob(
      [content],
      { type: 'application/dxf' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
