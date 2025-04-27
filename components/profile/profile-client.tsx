'use client';

import { useState } from 'react';
import { ProfileForm } from '@/components/profile/profile-form';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileClientProps {
  initialProfile: User;
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [profile, setProfile] = useState<User>(initialProfile);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
    setIsEditMode(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {!isEditMode && (
          <Button
            onClick={toggleEditMode}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      <ProfileForm
        profile={profile}
        isEditMode={isEditMode}
        onEditToggle={toggleEditMode}
        onProfileUpdate={handleProfileUpdate}
        readOnly={!isEditMode}
      />
    </>
  );
}
