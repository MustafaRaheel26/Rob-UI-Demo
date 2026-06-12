export interface EZNotification {
  id: string;
  type: 'New Shift' | 'Shift Confirmed' | 'Document Verified' | 'Approval Received';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export const mockNotifications: EZNotification[] = [
  {
    id: 'notif_1',
    type: 'Approval Received',
    title: 'Account Approved!',
    body: 'Your HHA account is officially verified. You can now accept shifts with local agencies.',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '/dashboard'
  },
  {
    id: 'notif_2',
    type: 'Document Verified',
    title: 'HHA Certificate Verified',
    body: 'Your uploaded HHA Certification document was reviewed and validated by administrator Rob.',
    timestamp: 'Yesterday',
    isRead: true,
    actionUrl: '/onboarding'
  },
  {
    id: 'notif_3',
    type: 'New Shift',
    title: 'New Bergen County Shift Posted',
    body: 'Anchor Home Care just posted an 8-hour shift in Hackensack paying $25.00/hr.',
    timestamp: '2 days ago',
    isRead: true,
    actionUrl: '/map'
  },
  {
    id: 'notif_4',
    type: 'Shift Confirmed',
    title: 'Shift Confirmation',
    body: 'Your accepted shift with Golden Years Care on 2026-06-17 was confirmed by the agency.',
    timestamp: '3 days ago',
    isRead: true,
    actionUrl: '/dashboard'
  }
];
