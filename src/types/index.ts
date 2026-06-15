export type LocationType = 'port' | 'airport' | 'outside';

export interface Good {
  name: string;
  port?: number;
  airport?: number;
  outside?: number;
  copper?: number;
  iron?: number;
  gold?: number;
}

export interface Job {
  id: string;
  name: string;
  minLevel: number;
  locationType: 'port_airport' | 'outside';
  goods: Good[];
}

export interface CalcResult {
  totalRP: number;
  goodsNeeded: number;
  xpPerGood: number;
  startLevel: number;
  endLevel: number;
  jobName: string;
  goodName: string;
  locationName: string;
  copper?: number;
  iron?: number;
  gold?: number;
}
