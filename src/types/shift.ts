export interface Shift {
  id: string;
  agencyName: string;
  location: string;
  zipCode: string;
  county: 'Bergen' | 'Hudson' | 'Essex' | 'Passaic' | 'Morris';
  date: string;
  shiftTime: string; // e.g. "08:00 AM - 04:00 PM"
  hours: number;
  payRate: number;
  shiftValue: number; // calculated as hours * payRate
  platformFee: number; // calculated as shiftValue * 0.10
  distance: number; // mock distance in miles
  status: 'Open' | 'Accepted' | 'Completed';
  workerId?: string; // ID of the accepting HHA
  notes?: string;
  timeOfDay: 'Day' | 'Evening' | 'Night';
}
