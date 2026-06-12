import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DocumentUpload } from '../types/user';
import { Shift } from '../types/shift';
import { Conversation, Message } from '../types/message';
import { EZNotification, mockNotifications as initialNotifications } from '../data/mockNotifications';
import { BillingRecord } from '../types/billing';
import { mockUsers as initialUsers, mockAdmin } from '../data/mockUsers';
import { mockShifts as initialShifts } from '../data/mockShifts';
import { mockConversations as initialConversations } from '../data/mockMessages';
import { mockBillingRecords as initialBillingRecords } from '../data/mockBilling';

interface EZShiftContextType {
  currentUser: User | null;
  users: User[];
  shifts: Shift[];
  conversations: Conversation[];
  notifications: EZNotification[];
  billingRecords: BillingRecord[];
  
  // Auth actions
  loginAsWorker: (email: string) => boolean;
  loginAsAdmin: () => void;
  registerWorker: (data: { name: string; email: string; phone: string; county: User['county'] }) => User;
  logout: () => void;
  
  // Document actions
  uploadDocument: (docKey: keyof User['documents'], fileName: string) => void;
  verifyDocument: (workerId: string, docKey: keyof User['documents']) => void;
  approveWorker: (workerId: string) => void;
  rejectWorker: (workerId: string) => void;
  
  // Shift actions
  acceptShift: (shiftId: string) => void;
  postShift: (shiftData: Omit<Shift, 'id' | 'shiftValue' | 'platformFee' | 'status' | 'distance'>) => void;
  notifyWorkersAboutShift: (shiftId: string) => void;
  boostShiftRate: (shiftId: string) => void;
  
  // Chat actions
  sendMessage: (convId: string, text: string) => void;
  startNewConversation: (workerId: string) => string;
  
  // Notification actions
  markAllNotificationsAsRead: () => void;
  addNotification: (type: EZNotification['type'], title: string, body: string) => void;
  
  // Billing actions
  markAsInvoiced: (recordId: string) => void;
  markAsPaid: (recordId: string) => void;
}

const EZShiftContext = createContext<EZShiftContextType | undefined>(undefined);

export const EZShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial state from localStorage if available, otherwise use initial mock data
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ez_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ez_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('ez_shifts');
    return saved ? JSON.parse(saved) : initialShifts;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ez_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [notifications, setNotifications] = useState<EZNotification[]>(() => {
    const saved = localStorage.getItem('ez_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(() => {
    const saved = localStorage.getItem('ez_billingRecords');
    return saved ? JSON.parse(saved) : initialBillingRecords;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ez_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ez_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ez_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('ez_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ez_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ez_billingRecords', JSON.stringify(billingRecords));
  }, [billingRecords]);

  // LOGIN AS WORKER
  const loginAsWorker = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'Worker');
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // If not found, let's auto-create or return false (for login simplicity you can type any user)
    return false;
  };

  // LOGIN AS ADMIN
  const loginAsAdmin = () => {
    const adminUser: User = {
      id: mockAdmin.id,
      name: mockAdmin.name,
      email: mockAdmin.email,
      role: 'Admin',
      phone: mockAdmin.phone,
      county: mockAdmin.county,
      status: mockAdmin.status,
      documents: {
        hhaCertificate: { id: 'a1', name: 'HHA Certificate', status: 'Verified' },
        cprCertification: { id: 'a2', name: 'CPR Certification', status: 'Verified' },
        tbTestResult: { id: 'a3', name: 'TB Test Result', status: 'Verified' },
        governmentId: { id: 'a4', name: 'Government ID', status: 'Verified' }
      },
      completionPercentage: 100
    };
    setCurrentUser(adminUser);
  };

  // REGISTER
  const registerWorker = (data: { name: string; email: string; phone: string; county: User['county'] }) => {
    const newWorker: User = {
      id: `worker_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      county: data.county,
      role: 'Worker',
      status: 'Pending Approval',
      documents: {
        hhaCertificate: { id: `doc_${Date.now()}_1`, name: 'HHA Certificate', status: 'Not Uploaded' },
        cprCertification: { id: `doc_${Date.now()}_2`, name: 'CPR Certification', status: 'Not Uploaded' },
        tbTestResult: { id: `doc_${Date.now()}_3`, name: 'TB Test Result', status: 'Not Uploaded' },
        governmentId: { id: `doc_${Date.now()}_4`, name: 'Government ID', status: 'Not Uploaded' }
      },
      completionPercentage: 0
    };
    setUsers(prev => [newWorker, ...prev]);
    setCurrentUser(newWorker);
    
    // Add Welcome notification
    addNotification(
      'New Shift',
      'Welcome to EZ-Shift!',
      'Complete your onboarding docs so administrator Rob can approve your account quickly!'
    );
    
    return newWorker;
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(null);
  };

  // HELPER to recalculate completion percentage of a user
  const recalculateCompletion = (docs: User['documents']): number => {
    const values = Object.values(docs);
    const uploadedOrVerified = values.filter(d => d.status === 'Uploaded' || d.status === 'Verified').length;
    return Math.round((uploadedOrVerified / values.length) * 100);
  };

  // UPLOAD DOCUMENT (By current worker)
  const uploadDocument = (docKey: keyof User['documents'], fileName: string) => {
    if (!currentUser || currentUser.role !== 'Worker') return;

    const updatedDocs = {
      ...currentUser.documents,
      [docKey]: {
        ...currentUser.documents[docKey],
        status: 'Uploaded' as const,
        fileName,
        uploadDate: new Date().toISOString().split('T')[0]
      }
    };

    const completion = recalculateCompletion(updatedDocs);

    const updatedUser: User = {
      ...currentUser,
      documents: updatedDocs,
      completionPercentage: completion
    };

    // Update currentUser state
    setCurrentUser(updatedUser);

    // Update inside users array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Notify admin
    addNotification(
      'Document Verified',
      `Doc Uploaded: ${currentUser.name}`,
      `Uploaded their ${currentUser.documents[docKey].name} (${fileName}). Ready for approval.`
    );
  };

  // VERIFY DOCUMENT (By Admin)
  const verifyDocument = (workerId: string, docKey: keyof User['documents']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === workerId) {
        const updatedDocs = {
          ...u.documents,
          [docKey]: {
            ...u.documents[docKey],
            status: 'Verified' as const
          }
        };
        const completion = recalculateCompletion(updatedDocs);
        const updatedUser: User = { ...u, documents: updatedDocs, completionPercentage: completion };
        
        // If current user is this worker, update current user too
        if (currentUser && currentUser.id === workerId) {
          setCurrentUser(updatedUser);
        }

        // Add notification for the worker
        const docName = u.documents[docKey].name;
        const newNotif: EZNotification = {
          id: `notif_${Date.now()}`,
          type: 'Document Verified',
          title: `${docName} Verified`,
          body: `Admin verified your ${docName}. Core documentation is closer to approval.`,
          timestamp: 'Just now',
          isRead: false
        };
        setNotifications(n => [newNotif, ...n]);

        return updatedUser;
      }
      return u;
    }));
  };

  // APPROVE WORKER
  const approveWorker = (workerId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === workerId) {
        const updated = { ...u, status: 'Approved' as const };
        
        if (currentUser && currentUser.id === workerId) {
          setCurrentUser(updated);
        }

        // Add feedback notification
        const newNotif: EZNotification = {
          id: `notif_${Date.now()}`,
          type: 'Approval Received',
          title: 'Account Approved!',
          body: 'Congratulations! Admin Rob has fully approved your profile. You can now accept open shifts.',
          timestamp: 'Just now',
          isRead: false,
          actionUrl: '/dashboard'
        };
        setNotifications(n => [newNotif, ...n]);

        return updated;
      }
      return u;
    }));
  };

  // REJECT WORKER
  const rejectWorker = (workerId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === workerId) {
        const updated = { ...u, status: 'Rejected' as const };
        if (currentUser && currentUser.id === workerId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  // ACCEPT SHIFT
  const acceptShift = (shiftId: string) => {
    if (!currentUser) return;
    
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        const value = s.hours * s.payRate;
        const fee = value * 0.10;
        
        // Update shift
        const updatedShift: Shift = {
          ...s,
          status: 'Accepted',
          workerId: currentUser.id
        };

        // Auto-create a billing record in "Pending" status for this accepted shift when completed/accepted
        const newBilling: BillingRecord = {
          id: `bill_${Date.now()}`,
          shiftId: s.id,
          shiftDate: s.date,
          agencyName: s.agencyName,
          workerName: currentUser.name,
          hours: s.hours,
          payRate: s.payRate,
          shiftValue: value,
          ezShiftFee: fee,
          status: 'Pending'
        };

        setBillingRecords(br => [newBilling, ...br]);

        // Create alert notifications
        const workerNotif: EZNotification = {
          id: `notif_w_${Date.now()}`,
          type: 'Shift Confirmed',
          title: 'Shift Accepted!',
          body: `You accepted ${s.agencyName} in ${s.location} on ${s.date}.`,
          timestamp: 'Just now',
          isRead: false,
          actionUrl: '/dashboard'
        };

        const adminNotif: EZNotification = {
          id: `notif_a_${Date.now()}`,
          type: 'Shift Confirmed',
          title: 'Shift Staffed',
          body: `${currentUser.name} accepted ${s.agencyName} shift on ${s.date}.`,
          timestamp: 'Just now',
          isRead: false
        };

        setNotifications(n => [workerNotif, adminNotif, ...n]);

        return updatedShift;
      }
      return s;
    }));
  };

  // POST NEW SHIFT
  const postShift = (shiftData: Omit<Shift, 'id' | 'shiftValue' | 'platformFee' | 'status' | 'distance'>) => {
    const shiftValue = shiftData.hours * shiftData.payRate;
    const platformFee = shiftValue * 0.10;
    const mockDistance = parseFloat((Math.random() * 10 + 0.5).toFixed(1));
    
    const newShift: Shift = {
      ...shiftData,
      id: `shift_${Date.now()}`,
      shiftValue,
      platformFee,
      distance: mockDistance,
      status: 'Open'
    };

    setShifts(prev => [newShift, ...prev]);

    // Send notification about new shift
    const newNotif: EZNotification = {
      id: `notif_${Date.now()}`,
      type: 'New Shift',
      title: `New ${shiftData.county} Shift Posted`,
      body: `${shiftData.agencyName} posted a shift in ${shiftData.location} ($${shiftData.payRate}/hr).`,
      timestamp: 'Just now',
      isRead: false,
      actionUrl: '/map'
    };
    setNotifications(n => [newNotif, ...n]);
  };

  // NOTIFY WORKERS ABOUT SHIFT (Boost alerts)
  const notifyWorkersAboutShift = (shiftId: string) => {
    const s = shifts.find(item => item.id === shiftId);
    if (!s) return;

    addNotification(
      'New Shift',
      `Urgent: Fill ${s.agencyName} Shift!`,
      `We sent SMS Alerts to all approved HHAs in ${s.county} County for this $${s.payRate}/hr shift.`
    );
  };

  // BOOST SHIFT PAY RATE
  const boostShiftRate = (shiftId: string) => {
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId && s.status === 'Open') {
        const newRate = s.payRate + 2; // boost rate by $2
        const value = s.hours * newRate;
        const fee = value * 0.10;
        return {
          ...s,
          payRate: newRate,
          shiftValue: value,
          platformFee: fee,
          notes: s.notes ? `[BOOSTED +$2/hr] ${s.notes}` : '[BOOSTED +$2/hr]'
        };
      }
      return s;
    }));
  };

  // CHAT SEND MESSAGE
  const sendMessage = (convId: string, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          lastMessageText: text,
          lastMessageTime: newMessage.timestamp,
          unreadCount: 0,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    // Trigger responsive instant replies to simulated messages to make it feel amazing
    if (currentUser.role === 'Worker') {
      setTimeout(() => {
        const autoReply: Message = {
          id: `msg_reply_${Date.now()}`,
          senderId: 'admin_1',
          senderName: 'Rob (Admin)',
          senderRole: 'Admin',
          text: `Hi ${currentUser.name}! Received. I'm checking into this detail for you right now. Let me know if you have other documents ready.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setConversations(cList => cList.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              lastMessageText: autoReply.text,
              lastMessageTime: autoReply.timestamp,
              unreadCount: 1,
              messages: [...c.messages, autoReply]
            };
          }
          return c;
        }));
      }, 1500);
    }
  };

  // START NEW CONVERSATION
  const startNewConversation = (workerId: string) => {
    const existing = conversations.find(c => c.workerId === workerId);
    if (existing) return existing.id;

    const worker = users.find(u => u.id === workerId);
    if (!worker) return '';

    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      workerId: worker.id,
      workerName: worker.name,
      lastMessageText: 'Conversation started.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: []
    };

    setConversations(prev => [newConv, ...prev]);
    return newConvId;
  };

  // NOTIFICATION ACTIONS
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (type: EZNotification['type'], title: string, body: string) => {
    const newNotif: EZNotification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      body,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // BILLING ACTIONS
  const markAsInvoiced = (recordId: string) => {
    setBillingRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return { ...rec, status: 'Invoiced' as const };
      }
      return rec;
    }));
  };

  const markAsPaid = (recordId: string) => {
    setBillingRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return { ...rec, status: 'Paid' as const };
      }
      return rec;
    }));
  };

  return (
    <EZShiftContext.Provider value={{
      currentUser,
      users,
      shifts,
      conversations,
      notifications,
      billingRecords,
      loginAsWorker,
      loginAsAdmin,
      registerWorker,
      logout,
      uploadDocument,
      verifyDocument,
      approveWorker,
      rejectWorker,
      acceptShift,
      postShift,
      notifyWorkersAboutShift,
      boostShiftRate,
      sendMessage,
      startNewConversation,
      markAllNotificationsAsRead,
      addNotification,
      markAsInvoiced,
      markAsPaid
    }}>
      {children}
    </EZShiftContext.Provider>
  );
};

export const useEZShift = () => {
  const context = useContext(EZShiftContext);
  if (context === undefined) {
    throw new Error('useEZShift must be used within an EZShiftProvider');
  }
  return context;
};
