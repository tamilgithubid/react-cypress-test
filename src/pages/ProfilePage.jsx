import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div data-cy="profile-page" className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card data-cy="user-info-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div
              data-cy="user-avatar"
              className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <User size={32} className="text-gray-500" />
            </div>
            <div>
              <p data-cy="profile-name" className="text-lg font-semibold">{user?.name}</p>
              <p data-cy="profile-email" className="text-sm text-gray-500 flex items-center gap-1">
                <Mail size={14} />
                {user?.email}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card data-cy="edit-profile-section">
        <CardHeader>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" data-cy="edit-name" defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" data-cy="edit-email" defaultValue={user?.email} />
          </div>
          <Button data-cy="save-profile" className="w-full">Save Changes</Button>
        </CardContent>
      </Card>

      <Button
        data-cy="profile-logout"
        onClick={logout}
        className="w-full"
      >
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}
