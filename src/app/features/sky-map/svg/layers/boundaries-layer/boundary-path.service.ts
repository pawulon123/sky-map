import { computed, inject, Injectable, Signal } from '@angular/core';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { BoundariesService } from '../../../domain/services/boundaries/boundaries.service';
import { Boundary, BoundaryPath, PieceState, ScreenChunk } from '../../../domain/models/boundary.model';
import { segmentToScreenChunks } from './segment-to-screen-chunks';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';

type RaDec = [number, number];

@Injectable({ providedIn: 'root' })
export class BoundaryPathService {
  private proj = inject(ProjectionService);
  private boundariesSv = inject(BoundariesService);
  private selectedId = inject(SelectedIdService);

  private readonly dedupeDecimals = 5;

  constructor() {
    this.boundariesSv.loadOnce();
  }

  readonly paths: Signal<BoundaryPath[]> = computed(() => this.buildPaths());

  private buildPaths(): BoundaryPath[] {
    const boundaries = this.getFilteredBoundaries();
    if (!boundaries.length) return [];

    const ordered = this.orderBoundaries(boundaries);
    const drawnEdges = this.createDrawnEdgesSet();

    return ordered.flatMap((b) => this.boundaryToPaths(b, drawnEdges));
  }

  private getFilteredBoundaries(): Boundary[] {
    const { boundaries = [] } = this.boundariesSv.data();
    return this.selectedId.filter(boundaries);
  }

  private orderBoundaries(boundaries: Boundary[]): Boundary[] {
    return [...boundaries].sort(this.sortByAbbrev);
  }

  private sortByAbbrev(a: Boundary, b: Boundary): number {
    return (a.abbrev || '').localeCompare(b.abbrev || '');
  }

  private createDrawnEdgesSet(): Set<string> {
    return new Set<string>();
  }

  private boundaryToPaths(boundary: Boundary, drawnEdges: Set<string>): BoundaryPath[] {
    const segments = this.getSegments(boundary);
    return segments.flatMap((seg) => this.segmentToPaths(seg, boundary, drawnEdges));
  }

  private getSegments(boundary: Boundary): RaDec[][] {
    return boundary.segments ?? [];
  }

  private segmentToPaths(seg: RaDec[], boundary: Boundary, drawnEdges: Set<string>): BoundaryPath[] {
    if (!this.isValidPolyline(seg)) return [];

    const pieces = this.polylineToPiecesDedup(seg, drawnEdges);

    return pieces
      .flatMap((piece) => this.projectPieceToChunks(piece))
      .map((chunk) => this.chunkToD(chunk))
      .filter(this.isNonEmptyString)
      .map((d) => ({ d, boundary }));
  }

  private isValidPolyline(poly: RaDec[]): boolean {
    return Array.isArray(poly) && poly.length >= 2;
  }

  private polylineToPiecesDedup(poly: RaDec[], drawnEdges: Set<string>): RaDec[][] {
    const init = this.initPieceState(poly[0]);

    const final = poly.slice(1).reduce((st, p2, idx) => {
      const p1 = poly[idx];
      return this.stepPieceState(st, p1, p2, drawnEdges);
    }, init);

    return this.finalizePieces(final);
  }

  private initPieceState(first: RaDec): PieceState {
    return {
      pieces: [],
      current: [first],
    };
  }

  private stepPieceState(st: PieceState, p1: RaDec, p2: RaDec, drawnEdges: Set<string>): PieceState {
    if (!this.isValidPoint(p1) || !this.isValidPoint(p2)) return st;
    if (this.isZeroEdge(p1, p2)) return st;

    const key = this.edgeKeyCanonical(p1, p2);

    if (drawnEdges.has(key)) {
      const pieces = this.pushCurrentIfValid(st.pieces, st.current);
      return { pieces, current: [p2] };
    }

    drawnEdges.add(key);
    return { pieces: st.pieces, current: [...st.current, p2] };
  }

  private finalizePieces(st: PieceState): RaDec[][] {
    return this.pushCurrentIfValid(st.pieces, st.current);
  }

  private pushCurrentIfValid(pieces: RaDec[][], current: RaDec[]): RaDec[][] {
    return current.length >= 2 ? [...pieces, current] : pieces;
  }

  private isValidPoint(p: RaDec): boolean {
    return Array.isArray(p) && p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]);
  }

  private isZeroEdge(a: RaDec, b: RaDec): boolean {
    return a[0] === b[0] && a[1] === b[1];
  }

  private edgeKeyCanonical(p1: RaDec, p2: RaDec): string {
    const a = this.roundPoint(p1);
    const b = this.roundPoint(p2);

    const ka = this.pointKey(a);
    const kb = this.pointKey(b);

    return ka <= kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  }

  private roundPoint(p: RaDec): RaDec {
    return [this.round(p[0]), this.round(p[1])];
  }

  private round(v: number): number {
    const f = Math.pow(10, this.dedupeDecimals);
    return Math.round(v * f) / f;
  }

  private pointKey(p: RaDec): string {
    return `${p[0].toFixed(this.dedupeDecimals)},${p[1].toFixed(this.dedupeDecimals)}`;
  }

  private projectPieceToChunks(piece: RaDec[]): ScreenChunk[] {
    return segmentToScreenChunks(piece, this.proj.settings, this.proj.getProjectionByLonLat.bind(this.proj));
  }

  private chunkToD(chunkXY: ScreenChunk): string {
    if (!chunkXY || chunkXY.length < 2) return '';

    const head = this.moveTo(chunkXY[0]);
    const tail = chunkXY.slice(1).map(this.lineTo).join('');

    return head + tail;
  }

  private moveTo = ([x, y]: [number, number]): string => `M${x},${y}`;

  private lineTo = ([x, y]: [number, number]): string => `L${x},${y}`;

  private isNonEmptyString(v: string): v is string {
    return typeof v === 'string' && v.length > 0;
  }
}
