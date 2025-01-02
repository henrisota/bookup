export enum BookUpType {
  PERIODIC = 'PERIODIC',
  ON_DEMAND = 'ON_DEMAND'
};

export interface BookUp {
  type: BookUpType
  time: number
  digest: string
  size: number
  content?: string
};
