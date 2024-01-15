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
