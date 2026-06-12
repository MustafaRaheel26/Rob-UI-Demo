import { Conversation } from '../types/message';

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    workerId: 'worker_1',
    workerName: 'Sarah Jenkins',
    lastMessageText: 'Thanks! I will make sure to arrive 10 minutes early.',
    lastMessageTime: '09:30 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_1_1',
        senderId: 'admin_1',
        senderName: 'Rob (Admin)',
        senderRole: 'Admin',
        text: 'Hi Sarah, your HHA Certificate has been approved! You are ready to accept shifts now.',
        timestamp: 'Yesterday, 02:15 PM'
      },
      {
        id: 'msg_1_2',
        senderId: 'worker_1',
        senderName: 'Sarah Jenkins',
        senderRole: 'Worker',
        text: 'Awesome, thanks! I just accepted the Golden Years Care shift for June 17th.',
        timestamp: 'Yesterday, 02:40 PM'
      },
      {
        id: 'msg_1_3',
        senderId: 'admin_1',
        senderName: 'Rob (Admin)',
        senderRole: 'Admin',
        text: 'Perfect. They are looking forward to having you. Let us know if you need anything!',
        timestamp: 'Today, 09:12 AM'
      },
      {
        id: 'msg_1_4',
        senderId: 'worker_1',
        senderName: 'Sarah Jenkins',
        senderRole: 'Worker',
        text: 'Thanks! I will make sure to arrive 10 minutes early.',
        timestamp: 'Today, 09:30 AM'
      }
    ]
  },
  {
    id: 'conv_2',
    workerId: 'worker_2',
    workerName: 'Marcus Vance',
    lastMessageText: 'Hello, what test form do you recommend for the TB result?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      {
        id: 'msg_2_1',
        senderId: 'worker_2',
        senderName: 'Marcus Vance',
        senderRole: 'Worker',
        text: 'Hello, what test form do you recommend for the TB result?',
        timestamp: 'Yesterday, 04:55 PM'
      }
    ]
  },
  {
    id: 'conv_3',
    workerId: 'worker_3',
    workerName: 'Elena Rostova',
    lastMessageText: 'I just uploaded my TB test. Can you check if it is formatted okay?',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_3_1',
        senderId: 'worker_3',
        senderName: 'Elena Rostova',
        senderRole: 'Worker',
        text: 'Hi there, I uploaded all my documents!',
        timestamp: '2 days ago, 11:00 AM'
      },
      {
        id: 'msg_3_2',
        senderId: 'admin_1',
        senderName: 'Rob (Admin)',
        senderRole: 'Admin',
        text: 'Hi Elena! We are reviewing them right now. All certifications look clean so far.',
        timestamp: '2 days ago, 11:30 AM'
      },
      {
        id: 'msg_3_3',
        senderId: 'worker_3',
        senderName: 'Elena Rostova',
        senderRole: 'Worker',
        text: 'I just uploaded my TB test. Can you check if it is formatted okay?',
        timestamp: '2 days ago, 11:32 AM'
      }
    ]
  }
];
