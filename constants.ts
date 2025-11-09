import { DocumentCategory, FamilyMember } from './types';

export const CATEGORIES: DocumentCategory[] = [
  DocumentCategory.Warranty,
  DocumentCategory.UtilityBill,
  DocumentCategory.MedicalReceipt,
  DocumentCategory.MedicalRecord,
  DocumentCategory.InsurancePolicy,
  DocumentCategory.GeneralReceipt,
  DocumentCategory.Other,
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
    { id: 'self', name: 'Self' },
];

export const CATEGORY_COLORS: { [key in DocumentCategory]: string } = {
    [DocumentCategory.Warranty]: 'bg-sauna-coral',
    [DocumentCategory.UtilityBill]: 'bg-sauna-apricot',
    [DocumentCategory.MedicalReceipt]: 'bg-red-400', // Keep red for urgency
    [DocumentCategory.MedicalRecord]: 'bg-sauna-mint',
    [DocumentCategory.InsurancePolicy]: 'bg-green-400',
    [DocumentCategory.GeneralReceipt]: 'bg-blue-400',
    [DocumentCategory.Other]: 'bg-sauna-soft-text',
};

export const CALENDAR_EVENT_COLORS = {
    warranty: 'bg-sauna-coral',
    bill: 'bg-sauna-apricot',
    appointment: 'bg-sauna-mint',
    insurance: 'bg-green-500',
    general: 'bg-blue-400',
};

export const CURRENCIES: { [key: string]: { symbol: string; name: string } } = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
};
