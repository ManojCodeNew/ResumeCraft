import React, { useRef } from 'react';
import { PersonalInfo } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Image, Upload, User } from 'lucide-react';
import { generateId } from '@/utils/id';

interface PersonalInformationEditorProps {
  personalInfo: PersonalInfo;
  onChange: (info: Partial<PersonalInfo>) => void;
}

export const PersonalInformationEditor: React.FC<PersonalInformationEditorProps> = ({
  personalInfo,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PersonalInfo, value: string | boolean) => {
    onChange({ [field]: value });
  };

  const handleAddCustomLink = () => {
    const currentLinks = personalInfo.customLinks || [];
    onChange({
      customLinks: [...currentLinks, { id: generateId('link'), label: '', url: '' }],
    });
  };

  const handleCustomLinkChange = (id: string, field: 'label' | 'url', value: string) => {
    const currentLinks = personalInfo.customLinks || [];
    onChange({
      customLinks: currentLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    });
  };

  const handleRemoveCustomLink = (id: string) => {
    const currentLinks = personalInfo.customLinks || [];
    onChange({
      customLinks: currentLinks.filter((l) => l.id !== id),
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type & size (< 4MB)
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('File size exceeds 4MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange({
        photoUrl: base64,
        showPhoto: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({
      photoUrl: '',
      showPhoto: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-500">
            Contact information rendered at the top of your resume.
          </p>
        </div>

        {/* Photo Toggle Pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={personalInfo.showPhoto || false}
              onChange={(e) => handleInputChange('showPhoto', e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Image className="h-3.5 w-3.5 text-slate-500" />
              <span>Include Photo on Resume</span>
            </span>
          </label>
        </div>
      </div>

      {/* Photo Upload Section (if enabled) */}
      {personalInfo.showPhoto && (
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center gap-4 text-xs animate-in fade-in">
          {personalInfo.photoUrl ? (
            <div className="relative group shrink-0">
              <img
                src={personalInfo.photoUrl}
                alt="Profile Preview"
                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0 border border-slate-300">
              <User className="h-8 w-8" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-1">
            <p className="font-semibold text-slate-800">Profile Photo</p>
            <p className="text-[11px] text-slate-500">
              Upload a professional portrait (PNG, JPG, or WEBP). It will be rendered next to your name.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-7 px-2.5 gap-1"
              >
                <Upload className="h-3 w-3" />
                <span>{personalInfo.photoUrl ? 'Change Photo' : 'Upload Image'}</span>
              </Button>

              {personalInfo.photoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. MANOJ C"
          value={personalInfo.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />
        <Input
          label="Professional Headline (optional)"
          placeholder="e.g. Software Engineer"
          value={personalInfo.headline || ''}
          onChange={(e) => handleInputChange('headline', e.target.value)}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. 9482292440"
          value={personalInfo.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. manojpoojary2004@gmail.com"
          value={personalInfo.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            label="Location"
            placeholder="e.g. Bengaluru"
            value={personalInfo.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Online Profiles & Links */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <span className="text-xs font-semibold text-slate-700 block">Links & Social Profiles</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="LinkedIn URL"
            placeholder="https://www.linkedin.com/in/..."
            value={personalInfo.linkedinUrl || ''}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
          />
          <Input
            label="GitHub URL"
            placeholder="https://github.com/..."
            value={personalInfo.githubUrl || ''}
            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
          />
          <Input
            label="Portfolio / Website URL"
            placeholder="https://..."
            value={personalInfo.portfolioUrl || ''}
            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
          />
        </div>

        {/* Custom Links */}
        {personalInfo.customLinks && personalInfo.customLinks.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-slate-600 block">Additional Links:</span>
            {personalInfo.customLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <Input
                  placeholder="Label (e.g. Portfolio)"
                  value={link.label}
                  onChange={(e) => handleCustomLinkChange(link.id, 'label', e.target.value)}
                  className="w-1/3"
                />
                <Input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => handleCustomLinkChange(link.id, 'url', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCustomLink(link.id)}
                  title="Remove link"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCustomLink}
            className="text-xs gap-1.5 text-slate-600"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Link</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
