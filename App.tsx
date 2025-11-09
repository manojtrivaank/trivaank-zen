import React, { useState, useMemo, useEffect } from 'react';
import { useDocuments } from './hooks/useDocuments';
import { View, CalendarEvent, DocumentCategory, Document } from './types';
import { Icon } from './components/Icon';
import { AddDocumentFlow } from './components/AddDocumentFlow';
import { Modal } from './components/common/Modal';
import { Dashboard } from './components/Dashboard';
import { DocumentList } from './components/DocumentList';
import { CalendarView } from './components/CalendarView';
import { FamilyProfiles } from './components/FamilyProfiles';
import { LoadingScreen } from './components/LoadingScreen';

const BottomNav: React.FC<{ currentView: View; setView: (view: View) => void }> = ({ currentView, setView }) => {
  const navItems: { view: View; label: string; icon: 'dashboard' | 'docs' | 'calendar' | 'profile' }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { view: 'documents', label: 'Documents', icon: 'docs' },
    { view: 'calendar', label: 'Calendar', icon: 'calendar' },
    { view: 'profiles', label: 'Profiles', icon: 'profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-sauna-dark-card/80 backdrop-blur-md border-t border-gray-200 dark:border-sauna-dark-border shadow-t-lg z-20">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${
              currentView === item.view ? 'text-sauna-coral' : 'text-sauna-soft-text dark:text-sauna-dark-soft-text hover:text-sauna-coral'
            }`}
          >
            <Icon icon={item.icon} className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const { 
    documents, 
    familyMembers, 
    userSettings,
    isLoading, 
    addDocument, 
    deleteDocument, 
    updateDocument, 
    addFamilyMember, 
    deleteFamilyMember,
    updateUserSettings,
  } = useDocuments();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // When the main view changes, close any open document detail view.
  useEffect(() => {
    setSelectedDoc(null);
  }, [view]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    return documents.flatMap(doc => {
      const events: CalendarEvent[] = [];
      const { date, warrantyEndDate } = doc.metadata;

      // Handle warranty expiration separately as it uses a different date field.
      if (doc.category === DocumentCategory.Warranty && warrantyEndDate) {
        events.push({ date: warrantyEndDate, type: 'warranty', title: `${doc.title} expires`, documentId: doc.id });
      }
      
      if (date) {
        // To handle timezone issues where new Date("YYYY-MM-DD") might be off by a day,
        // we create the date using parts to ensure it's in the user's local timezone.
        const dateParts = date.split('-').map(Number);
        const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        switch (doc.category) {
            case DocumentCategory.UtilityBill:
                const dueDate = new Date(localDate);
                dueDate.setDate(dueDate.getDate() + 15);
                events.push({ date: dueDate.toISOString().split('T')[0], type: 'bill', title: `${doc.title} due`, documentId: doc.id });
                break;
            case DocumentCategory.MedicalRecord:
                events.push({ date, type: 'appointment', title: doc.title, documentId: doc.id });
                break;
            case DocumentCategory.InsurancePolicy:
                 const renewalDate = new Date(localDate);
                 renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                 events.push({ date: renewalDate.toISOString().split('T')[0], type: 'insurance', title: `${doc.title} renewal`, documentId: doc.id });
                 break;
            case DocumentCategory.Warranty:
                 // The main event for a warranty is its expiration, which is handled above.
                 // We add a case here to prevent it from falling into the default case
                 // and creating a duplicate event for its purchase date.
                 break;
            default:
                // For all other categories with a date, add a general event.
                events.push({ date, type: 'general', title: doc.title, documentId: doc.id });
                break;
        }
      }
      return events;
    });
  }, [documents]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard documents={documents} calendarEvents={calendarEvents} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      case 'documents':
        return <DocumentList 
                  documents={documents} 
                  familyMembers={familyMembers} 
                  updateDocument={updateDocument} 
                  deleteDocument={deleteDocument} 
                  currency={userSettings.currency} 
                  selectedDoc={selectedDoc}
                  setSelectedDoc={setSelectedDoc}
                />;
      case 'calendar':
        return <CalendarView events={calendarEvents} />;
      case 'profiles':
        return <FamilyProfiles familyMembers={familyMembers} onAddMember={addFamilyMember} onDeleteMember={deleteFamilyMember} userSettings={userSettings} onUpdateSettings={updateUserSettings} />;
      default:
        return <Dashboard documents={documents} calendarEvents={calendarEvents} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
    }
  };

  return (
    <div className="min-h-screen bg-sauna-bg dark:bg-sauna-dark-bg font-sans text-sauna-text dark:text-sauna-dark-text transition-colors duration-300">
      <main className="pb-24">
        {isLoading ? <LoadingScreen /> : renderView()}
      </main>
      
      {!selectedDoc && (
        <div className="fixed bottom-24 right-5 z-30">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="bg-sauna-coral hover:opacity-90 text-white rounded-full p-4 shadow-xl transform hover:scale-110 transition-transform duration-200"
            aria-label="Add Document"
          >
            <Icon icon="add" className="w-8 h-8"/>
          </button>
        </div>
      )}

      <BottomNav currentView={view} setView={setView} />

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add a New Document">
        <AddDocumentFlow 
          onAddDocument={addDocument}
          familyMembers={familyMembers}
          onClose={() => setAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;