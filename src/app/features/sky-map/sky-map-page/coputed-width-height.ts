import { ProjectionSettings } from '../domain/models/projection-options.model';

export const coputedWidthHeight = ({
  width,
  height,
  mode,
  gap,
  columns,
  panelSize: { w, h },
  selected,
}: ProjectionSettings) => {
  if (mode === 'panels') {
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 0;
    const MARGIN_TOP = 10;
    const MARGIN_BOTTOM = 20;

    const count = selected.length;

    if (count > 0 && columns > 0) {
      const colsUsed = Math.min(columns, count);
      const rows = Math.ceil(count / colsUsed);

      const totalW = colsUsed * w + (colsUsed - 1) * gap;
      const totalH = rows * h + (rows - 1) * gap;

      // viewBox dostanie te wymiary -> nic nie będzie ucięte
      width = Math.round(totalW + MARGIN_LEFT + MARGIN_RIGHT);
      height = Math.round(totalH + MARGIN_TOP + MARGIN_BOTTOM);
    } else {
      width = Math.round(w + MARGIN_LEFT + MARGIN_RIGHT);
      height = Math.round(h + MARGIN_TOP + MARGIN_BOTTOM);
    }
  }

  return { width, height };
};
