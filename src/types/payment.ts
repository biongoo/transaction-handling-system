import { Car } from '.';

export type Payment = {
    status: 'new' | 'paid';
    value: number;
    days: number;
    orderId: number;
    car: Car;
};
