export type Payment = {
  _id: string;
  status: 'new' | 'paid' | 'canceled';
  value: number;
  days: number;
  carName: string;
};
