export enum DocumentCategory {
  Warranty = "Warranty",
  UtilityBill = "Utility Bill",
  MedicalReceipt = "Medical Receipt",
  MedicalRecord = "Medical Record",
  InsurancePolicy = "Insurance Policy",
  GeneralReceipt = "General Receipt",
  Other = "Other",
}

export interface FamilyMember {
  id: string;
  name: string;
}

export interface DocumentMetadata {
  date: string;
  vendor: string;
  amount?: number;
  policyNumber: string;
  warrantyEndDate: string;
}

export interface AudioRecording {
  id: string;
  dataUrl: string;
  duration: number; // in seconds
  timestamp: string;
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  createdAt: string;
  file: {
    name: string;
    type: string;
    dataUrl: string; // base64 data URL
  };
  ocrText: string;
  summary?: string;
  metadata: Partial<DocumentMetadata>;
  tags: string[];
  notes: string;
  familyMemberId?: string;
  audioRecording?: AudioRecording;
}

export type View = 'dashboard' | 'documents' | 'calendar' | 'profiles';

export interface CalendarEvent {
  date: string;
  type: 'warranty' | 'bill' | 'appointment' | 'insurance' | 'general';
  title: string;
  documentId: string;
}

export interface UserSettings {
  currency: string; // e.g., 'INR', 'USD'
}
