import React from 'react';
import { CertificationsSection, CertificationEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface CertificationsEditorProps {
  section: CertificationsSection;
  onChange: (updated: CertificationsSection) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ section, onChange }) => {
  const handleAddCert = () => {
    const newCert: CertificationEntry = {
      id: generateId('cert'),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
    };
    onChange({
      ...section,
      entries: [...section.entries, newCert],
    });
  };

  const handleUpdateCert = (id: string, updates: Partial<CertificationEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const handleDeleteCert = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No certifications added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAddCert}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Certification
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.entries.map((cert) => (
            <div
              key={cert.id}
              className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  {cert.name || 'Untitled Certification'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCert(cert.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <Input
                  label="Certification Name *"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={cert.name}
                  onChange={(e) => handleUpdateCert(cert.id, { name: e.target.value })}
                />
                <Input
                  label="Issuing Organization *"
                  placeholder="e.g. Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => handleUpdateCert(cert.id, { issuer: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Issue Date"
                    placeholder="e.g. Sep 2023"
                    value={cert.issueDate || ''}
                    onChange={(e) => handleUpdateCert(cert.id, { issueDate: e.target.value })}
                  />
                  <Input
                    label="Expiry Date"
                    placeholder="e.g. Sep 2026"
                    value={cert.expiryDate || ''}
                    onChange={(e) => handleUpdateCert(cert.id, { expiryDate: e.target.value })}
                  />
                </div>
                <Input
                  label="Credential URL"
                  placeholder="https://..."
                  value={cert.credentialUrl || ''}
                  onChange={(e) => handleUpdateCert(cert.id, { credentialUrl: e.target.value })}
                />
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={handleAddCert} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Certification
          </Button>
        </div>
      )}
    </div>
  );
};

