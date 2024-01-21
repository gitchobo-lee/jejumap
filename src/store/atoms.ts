import { atom } from "recoil";
export interface IAlldata {
  type: string;
  totalFeatures: number;
  features: IFeature[];
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  bbox: number[];
}

export interface IFeature {
  type: string;
  properties: { addr: string; bbox: number[] };
  id: string;
  geometry_name: string;
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

export interface IAddressAndPolygon {
  polygon: number[][][];
  address: string;
}

export interface IPolygonQuery {
  allPolygon: {
    polygons: number[][][];
  };
}

export interface IIllegalBuilding {
  polygon: number[][];
  address: string;
}

export interface IAddressAppear {
  address: string;
  times: number;
  polygon: number[][];
}

export interface IAddressAndCheck {
  address: string;
  check?: boolean;
  comment?: string;
  polygon: number[][];
}
export interface IContent {
  text: string;
  data: IAddressAndCheck[];
  onClickFunction?: any;
}

export const addressAndCheckAtom = atom<IAddressAndCheck[]>({
  key: "addressAndChecks",
  default: [],
});

export interface IJustFunction {
  onClickFunction?: any;
}
