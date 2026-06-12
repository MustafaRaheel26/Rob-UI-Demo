import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: 'worker_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'Worker',
    phone: '(201) 555-0143',
    county: 'Bergen',
    status: 'Approved',
    documents: {
      hhaCertificate: { id: 'doc_1', name: 'HHA Certificate', status: 'Verified', fileName: 'HHA_Cert_Jenkins.pdf', uploadDate: '2026-05-10' },
      cprCertification: { id: 'doc_2', name: 'CPR Certification', status: 'Verified', fileName: 'CPR_Cert_Jenkins.pdf', uploadDate: '2026-05-12' },
      tbTestResult: { id: 'doc_3', name: 'TB Test Result', status: 'Verified', fileName: 'TB_Clearance_Jenkins.pdf', uploadDate: '2026-05-14' },
      governmentId: { id: 'doc_4', name: 'Government ID', status: 'Verified', fileName: 'NJ_Drivers_License_Jenkins.png', uploadDate: '2026-05-09' }
    },
    completionPercentage: 100
  },
  {
    id: 'worker_2',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    role: 'Worker',
    phone: '(973) 555-0182',
    county: 'Essex',
    status: 'Pending Approval',
    documents: {
      hhaCertificate: { id: 'doc_5', name: 'HHA Certificate', status: 'Uploaded', fileName: 'HHA_Certification_MV.pdf', uploadDate: '2026-06-08' },
      cprCertification: { id: 'doc_6', name: 'CPR Certification', status: 'Uploaded', fileName: 'AHA_CPR_Marcus.pdf', uploadDate: '2026-06-08' },
      tbTestResult: { id: 'doc_7', name: 'TB Test Result', status: 'Not Uploaded' },
      governmentId: { id: 'doc_8', name: 'Government ID', status: 'Verified', fileName: 'US_Passport_Marcus.png', uploadDate: '2026-06-02' }
    },
    completionPercentage: 75
  },
  {
    id: 'worker_3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    role: 'Worker',
    phone: '(201) 555-0199',
    county: 'Hudson',
    status: 'Pending Approval',
    documents: {
      hhaCertificate: { id: 'doc_9', name: 'HHA Certificate', status: 'Uploaded', fileName: 'Elena_R_Cert.pdf', uploadDate: '2026-06-11' },
      cprCertification: { id: 'doc_10', name: 'CPR Certification', status: 'Uploaded', fileName: 'CPR_Card_Rostova.pdf', uploadDate: '2026-06-11' },
      tbTestResult: { id: 'doc_11', name: 'TB Test Result', status: 'Uploaded', fileName: 'TB_Negative_Elena.pdf', uploadDate: '2026-06-11' },
      governmentId: { id: 'doc_12', name: 'Government ID', status: 'Uploaded', fileName: 'NJ_State_ID.jpg', uploadDate: '2026-06-11' }
    },
    completionPercentage: 100
  },
  {
    id: 'worker_4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Worker',
    phone: '(973) 555-0245',
    county: 'Passaic',
    status: 'Approved',
    documents: {
      hhaCertificate: { id: 'doc_13', name: 'HHA Certificate', status: 'Verified', fileName: 'HHA_Passaic_DKim.pdf', uploadDate: '2026-04-18' },
      cprCertification: { id: 'doc_14', name: 'CPR Certification', status: 'Verified', fileName: 'CPR_Kim.pdf', uploadDate: '2026-04-20' },
      tbTestResult: { id: 'doc_15', name: 'TB Test Result', status: 'Verified', fileName: 'TB_Form.pdf', uploadDate: '2026-04-20' },
      governmentId: { id: 'doc_16', name: 'Government ID', status: 'Verified', fileName: 'License.jpg', uploadDate: '2026-04-15' }
    },
    completionPercentage: 100
  },
  {
    id: 'worker_5',
    name: 'Amina Diop',
    email: 'amina.diop@example.com',
    role: 'Worker',
    phone: '(973) 555-0311',
    county: 'Morris',
    status: 'Pending Approval',
    documents: {
      hhaCertificate: { id: 'doc_17', name: 'HHA Certificate', status: 'Uploaded', fileName: 'Diop_HHA.pdf', uploadDate: '2026-06-05' },
      cprCertification: { id: 'doc_18', name: 'CPR Certification', status: 'Not Uploaded' },
      tbTestResult: { id: 'doc_19', name: 'TB Test Result', status: 'Not Uploaded' },
      governmentId: { id: 'doc_20', name: 'Government ID', status: 'Uploaded', fileName: 'A_Diop_ID.png', uploadDate: '2026-06-04' }
    },
    completionPercentage: 50
  }
];

export const mockAdmin = {
  id: 'admin_1',
  name: 'Rob (Demo Owner)',
  email: 'rob@ezshift.com',
  role: 'Admin' as const,
  phone: '(201) 555-0100',
  county: 'Bergen' as const,
  status: 'Approved' as const,
  completionPercentage: 100
};
