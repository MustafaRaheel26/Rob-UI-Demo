export interface DocumentUpload {
  id: string;
  name: string;
  status: 'Not Uploaded' | 'Uploaded' | 'Verified';
  fileName?: string;
  uploadDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Worker' | 'Admin';
  phone: string;
  county: 'Bergen' | 'Hudson' | 'Essex' | 'Passaic' | 'Morris';
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  documents: {
    hhaCertificate: DocumentUpload;
    cprCertification: DocumentUpload;
    tbTestResult: DocumentUpload;
    governmentId: DocumentUpload;
  };
  completionPercentage: number;
}
