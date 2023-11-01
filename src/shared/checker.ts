export const isObjectsEquals = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}
