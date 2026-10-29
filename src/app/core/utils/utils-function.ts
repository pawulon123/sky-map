export const isTheSameValuesOfObjects = (obj1: any, obj2: any) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const isInRange = (value: number, [min, max]: [number, number]): boolean => {
  return value >= min && value <= max;
};

export function update<S extends Record<string, any>, K extends keyof S & string>(
  partial: Partial<S> | Partial<S[K]>,
  current: S,
  firstLevelNestingKey?: K
): S {
  if (firstLevelNestingKey) {
    return {
      ...current,
      [firstLevelNestingKey]: {
        ...(current[firstLevelNestingKey] ?? {}),
        ...(partial as Partial<S[K]>),
      },
    };
  }

  return {
    ...current,
    ...(partial as Partial<S>),
  };
}
type Fn<T> = (arg: T) => T;
export const compose =
  <T>(...fns: Fn<T>[]) =>
  (initial: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), initial);

export const partial =
  (fn: Function, ...args: any[]) =>
  (...restArgs: any[]) =>
    fn(...args, ...restArgs);

  export const SVG_TO_MM = 25.4 / 96;

export function svgToMm(value: number): number {
  return value * SVG_TO_MM;
}
export function getDescribeStar(star: { r: number; name?: string }): string {
  const name = star.name ?? '';
  const diameterMm = svgToMm(star.r * 2);

  return `${name}\nŚrednica: ${diameterMm.toFixed(2)} mm`;
}
