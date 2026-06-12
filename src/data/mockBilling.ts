import { BillingRecord } from '../types/billing';

export const mockBillingRecords: BillingRecord[] = [
  {
    id: 'bill_1',
    shiftId: 'shift_comp_1',
    shiftDate: '2026-06-08',
    agencyName: 'Anchor Home Care',
    workerName: 'Sarah Jenkins',
    hours: 8,
    payRate: 25,
    shiftValue: 200,
    ezShiftFee: 20,
    status: 'Paid'
  },
  {
    id: 'bill_2',
    shiftId: 'shift_comp_2',
    shiftDate: '2026-06-09',
    agencyName: 'Serene Senior Care',
    workerName: 'David Kim',
    hours: 10,
    payRate: 27,
    shiftValue: 270,
    ezShiftFee: 27,
    status: 'Invoiced'
  },
  {
    id: 'bill_3',
    shiftId: 'shift_comp_3',
    shiftDate: '2026-06-10',
    agencyName: 'Valley Health Services',
    workerName: 'Sarah Jenkins',
    hours: 8,
    payRate: 28,
    shiftValue: 224,
    ezShiftFee: 22.4,
    status: 'Pending'
  },
  {
    id: 'bill_4',
    shiftId: 'shift_comp_4',
    shiftDate: '2026-06-11',
    agencyName: 'Golden Years Care',
    workerName: 'David Kim',
    hours: 6,
    payRate: 24,
    shiftValue: 144,
    ezShiftFee: 14.4,
    status: 'Pending'
  },
  {
    id: 'bill_5',
    shiftId: 'shift_comp_5',
    shiftDate: '2026-06-11',
    agencyName: 'Loving Care Agency',
    workerName: 'Marcus Vance',
    hours: 8,
    payRate: 26,
    shiftValue: 208,
    ezShiftFee: 20.8,
    status: 'Invoiced'
  }
];
