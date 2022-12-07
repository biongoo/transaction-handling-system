import { EngineType } from 'enums';
import { Feature } from './feature';

export type Car = {
  _id: string;
  name: string;
  pricePerDay: number;
  acceleration: number;
  engineType: EngineType;
  features: Feature[];
  url: string;
};
