import { Star } from '../../../domain/models/star.model';

export const hasNameOrBayer = ({ name, bayer }: Star) => stringOf(name).length > 0 || stringOf(bayer).length > 0;
export const projected = (s:[number, number]) => Array.isArray(s);
const stringOf = (s?: string) => String((s as any) ?? '').trim();
