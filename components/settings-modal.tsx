'use client';

import React, { useState } from 'react';
import { X, User, Bell, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth-context';
import { Input } from '@/components/ui/input';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userRole: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  userRole,
}: SettingsModalProps) {
  const router = useRouter();
  const { updateProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

  // Reset profile state when userName/userEmail changes
  React.useEffect(() => {
    setEditName(userName);
    setEditEmail(userEmail);
  }, [userName, userEmail]);

  // Security views
  const [securityTab, setSecurityTab] = useState<'menu' | 'password' | '2fa' | 'sessions'>('menu');

  // Password reset states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 2FA states
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSuccess, setTwoFactorSuccess] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState('');

  // Active sessions state
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', location: 'Bengaluru, India', date: 'Active now (Current)', isCurrent: true },
    { id: '2', device: 'Safari on iPhone 15 Pro', location: 'Mumbai, India', date: 'Last accessed: 2 hours ago', isCurrent: false },
    { id: '3', device: 'Firefox on macOS', location: 'Delhi, India', date: 'Last accessed: 5 days ago', isCurrent: false },
  ]);

  const handleLogout = () => {
    // Clear session from localStorage
    localStorage.removeItem('ledgerpro_session');
    
    // Redirect to login
    router.push('/login');
    router.refresh();
  };

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      alert('Full Name and Email cannot be empty');
      return;
    }
    if (updateProfile) {
      updateProfile(editName, editEmail);
    }
    setIsEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(false);
      setSecurityTab('menu');
    }, 2000);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode !== '123456' && twoFactorCode !== '000000') {
      setTwoFactorError('Invalid verification code (use 123456)');
      return;
    }
    setTwoFactorError('');
    setTwoFactorSuccess(true);
    setIs2FAEnabled(true);
    setTimeout(() => {
      setTwoFactorCode('');
      setTwoFactorSuccess(false);
      setSecurityTab('menu');
    }, 2000);
  };

  const handleRevokeOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    alert('All other active sessions have been successfully revoked.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'text-primary border-b-primary'
                : 'text-muted-foreground border-b-transparent hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'security'
                ? 'text-primary border-b-primary'
                : 'text-muted-foreground border-b-transparent hover:text-foreground'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'notifications'
                ? 'text-primary border-b-primary'
                : 'text-muted-foreground border-b-transparent hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Alerts
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <p className="px-3 py-2 bg-muted rounded text-foreground text-sm capitalize">
                  {userRole}
                </p>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter full name"
                      className="bg-card text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="bg-card text-foreground"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <p className="px-3 py-2 bg-muted rounded text-foreground text-sm">{userName}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <p className="px-3 py-2 bg-muted rounded text-foreground text-sm">{userEmail}</p>
                  </div>

                  <Button className="w-full mt-4" variant="outline" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              {securityTab === 'menu' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">Password</h3>
                    <p className="text-xs text-muted-foreground mb-3">Update your login password regularly.</p>
                    <Button className="w-full" variant="outline" onClick={() => setSecurityTab('password')}>
                      Change Password
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-foreground mb-1 text-sm flex items-center justify-between">
                      Two-Factor Authentication
                      {is2FAEnabled && <span className="text-xs text-success font-semibold">Enabled</span>}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add an extra layer of security to your account.
                    </p>
                    <Button className="w-full" variant="outline" onClick={() => setSecurityTab('2fa')}>
                      {is2FAEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">Active Sessions</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Manage your active sessions across devices ({sessions.length} active).
                    </p>
                    <Button className="w-full" variant="outline" onClick={() => setSecurityTab('sessions')}>
                      View Sessions
                    </Button>
                  </div>
                </div>
              )}

              {securityTab === 'password' && (
                <form onSubmit={handleSavePassword} className="space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">Change Password</h3>
                  
                  {passwordError && <p className="text-xs text-accent bg-accent/10 p-2 rounded">{passwordError}</p>}
                  {passwordSuccess && <p className="text-xs text-success bg-success/10 p-2 rounded">✓ Password changed successfully!</p>}
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Current Password</label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-card text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-card text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-card text-foreground"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={() => { setSecurityTab('menu'); setPasswordError(''); }} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Update Password
                    </Button>
                  </div>
                </form>
              )}

              {securityTab === '2fa' && (
                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <h3 className="font-semibold text-foreground text-sm">Setup Two-Factor Authentication</h3>
                  
                  {twoFactorError && <p className="text-xs text-accent bg-accent/10 p-2 rounded">{twoFactorError}</p>}
                  {twoFactorSuccess && <p className="text-xs text-success bg-success/10 p-2 rounded">✓ 2FA configured successfully!</p>}

                  <div className="p-4 bg-muted rounded-lg flex flex-col items-center justify-center gap-3">
                    {/* Mock QR Code representation */}
                    <div className="w-32 h-32 bg-foreground dark:bg-foreground rounded flex items-center justify-center border-4 border-muted p-1">
                      <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black relative">
                        {/* Mock QR Grid Pattern */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-2 border-white"></div>
                        <div className="absolute top-2 right-2 w-4 h-4 border-2 border-white"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-white"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40 text-[8px] font-mono font-bold select-none">QR CODE</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground">Scan QR Code or enter code manually</p>
                      <p className="text-[10px] text-muted-foreground mt-1 select-all font-mono bg-background/50 px-2 py-0.5 rounded">JBSWY3DPEHPK3PXP</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Enter 6-digit verification code</label>
                    <Input
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="e.g. 123456 (or 000000)"
                      className="bg-card text-foreground font-mono text-center tracking-widest text-lg"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={() => { setSecurityTab('menu'); setTwoFactorError(''); }} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Verify Code
                    </Button>
                  </div>
                </form>
              )}

              {securityTab === 'sessions' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-sm flex items-center justify-between">
                    Active Device Sessions
                    <Button variant="outline" size="sm" className="h-7 text-xs text-accent hover:bg-accent/10" onClick={handleRevokeOtherSessions}>
                      Revoke Others
                    </Button>
                  </h3>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {sessions.map(s => (
                      <div key={s.id} className="p-3 bg-muted rounded-lg flex items-start justify-between text-xs">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{s.device}</p>
                          <p className="text-muted-foreground">{s.location} • {s.date}</p>
                        </div>
                        {s.isCurrent && <span className="bg-success/15 text-success font-semibold px-2 py-0.5 rounded text-[10px]">Current</span>}
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => setSecurityTab('menu')} variant="outline" className="w-full text-xs">
                    Back to Security
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm font-medium">Request Updates</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm font-medium">Approval Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm font-medium">Weekly Reports</span>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm font-medium">System Alerts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <Button
            onClick={handleLogout}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
