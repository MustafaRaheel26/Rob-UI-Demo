import { Shift } from './shift';

export interface BillingRecord {
  id: string;
  shiftId: string;
  shiftDate: string;
  agencyName: string;
  workerName: string;
  hours: number;
  payRate: number;
  shiftValue: number;
  ezShiftFee: number;
  status: 'Pending' | 'Invoiced' | 'Paid';
}

export interface BillingSummary {
  totalShifts: number;
  totalShiftValue: number;
  totalFees: number;
}
