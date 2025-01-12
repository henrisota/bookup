export const SEPARATOR = '/';

export function getLastPathSegment(path: string) {
  return path.replace(new RegExp(SEPARATOR + '$'), '').split(SEPARATOR).pop() ?? '';
}
