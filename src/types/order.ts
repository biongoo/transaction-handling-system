import { Car } from './car';
import { Payment } from './payment';

export type Order = {
  car: Car;
  email: string;
  endDate: string;
  name: string;
  payment: Payment;
  phone: number;
  startDate: number;
  user: string;
  _id: string;
};
