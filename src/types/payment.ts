export type Payment = {
  _id: string;
  status: 'new' | 'paid';
  value: number;
  days: number;
  carName: string;
};
