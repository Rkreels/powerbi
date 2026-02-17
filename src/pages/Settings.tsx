import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Database, FileSpreadsheet, Bell, Shield, Brush, Globe, Check, Save } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataRefreshInterval, setDataRefreshInterval] = useState('hourly');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [hasChanges, setHasChanges] = useState(false);
  
  const markChanged = () => setHasChanges(true);

  const handleSaveSettings = () => {
    setHasChanges(false);
    toast({ title: "Settings saved", description: "Your settings have been updated successfully.", duration: 2000 });
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPass.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setShowPasswordDialog(false);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    toast({ title: "Password updated", description: "Your password has been changed successfully.", duration: 2000 });
  };
  
  const settingGroups = [
    { id: 'general', icon: <SettingsIcon size={16} />, label: 'General' },
    { id: 'account', icon: <User size={16} />, label: 'Account' },
    { id: 'data', icon: <Database size={16} />, label: 'Data Management' },
    { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
    { id: 'security', icon: <Shield size={16} />, label: 'Security' },
    { id: 'appearance', icon: <Brush size={16} />, label: 'Appearance' },
    { id: 'language', icon: <Globe size={16} />, label: 'Language & Region' },
  ];
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-4 md:p-6 border-b bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your Power BI experience</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveSettings}>
            <Save size={16} className="mr-2" />Save Changes
          </Button>
        )}
      </div>
      
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border rounded-md overflow-hidden">
              {settingGroups.map((group) => (
                <button
                  key={group.id}
                  className={`w-full flex items-center text-left px-4 py-3 text-sm hover:bg-gray-50 ${activeTab === group.id ? 'bg-gray-50 border-l-4 border-blue-600' : ''}`}
                  onClick={() => setActiveTab(group.id)}
                >
                  <span className={`mr-3 ${activeTab === group.id ? 'text-blue-600' : 'text-gray-500'}`}>{group.icon}</span>
                  <span className={activeTab === group.id ? 'font-medium' : ''}>{group.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white border rounded-md p-6">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">General Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Theme</label>
                        <select className="w-full p-2 border rounded-md" value={theme} onChange={(e) => { setTheme(e.target.value); markChanged(); }}>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Visualization Size</label>
                        <select className="w-full p-2 border rounded-md" onChange={markChanged}>
                          <option>Medium (600 x 400)</option>
                          <option>Small (400 x 300)</option>
                          <option>Large (800 x 600)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="autosave" checked={autoSave} onChange={(e) => { setAutoSave(e.target.checked); markChanged(); }} className="mr-2" />
                        <label htmlFor="autosave" className="text-sm">Enable auto-save</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="snapgrid" className="mr-2" defaultChecked onChange={markChanged} />
                        <label htmlFor="snapgrid" className="text-sm">Snap to grid</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center pb-4 border-b">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold mr-4">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{userName}</div>
                        <div className="text-sm text-gray-500">{email}</div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto" onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) toast({ title: "Photo updated", description: `Profile photo set to ${file.name}`, duration: 2000 });
                        };
                        input.click();
                      }}>Change Photo</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" className="w-full p-2 border rounded-md" value={userName} onChange={(e) => { setUserName(e.target.value); markChanged(); }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" className="w-full p-2 border rounded-md" value={email} onChange={(e) => { setEmail(e.target.value); markChanged(); }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>Change Password</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Data Management</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Refresh Interval</label>
                        <select className="w-full p-2 border rounded-md" value={dataRefreshInterval} onChange={(e) => { setDataRefreshInterval(e.target.value); markChanged(); }}>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="manual">Manual only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Refresh Time</label>
                        <input type="time" className="w-full p-2 border rounded-md" defaultValue="08:00" onChange={markChanged} />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Storage Used</span>
                        <span className="text-sm font-medium">1.2 GB of 5 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="enableNotifications" className="text-sm">Enable in-app notifications</label>
                      <input type="checkbox" id="enableNotifications" checked={notifications} onChange={(e) => { setNotifications(e.target.checked); markChanged(); }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="emailNotifs" className="text-sm">Email notifications</label>
                      <input type="checkbox" id="emailNotifs" checked={emailNotifications} onChange={(e) => { setEmailNotifications(e.target.checked); markChanged(); }} />
                    </div>
                    {['Data refresh completed', 'Report shared with me', 'Dashboard comments', 'Data alerts'].map((item, i) => (
                      <div key={i} className="flex items-center ml-4">
                        <input type="checkbox" id={`notif-${i}`} className="mr-2" defaultChecked disabled={!notifications} onChange={markChanged} />
                        <label htmlFor={`notif-${i}`} className={`text-sm ${!notifications ? 'text-gray-400' : ''}`}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input type="checkbox" id="2fa" className="mr-2" defaultChecked onChange={markChanged} />
                      <label htmlFor="2fa" className="text-sm">Two-factor authentication</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="encrypt" className="mr-2" defaultChecked onChange={markChanged} />
                      <label htmlFor="encrypt" className="text-sm">Encrypt all data connections</label>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Session timeout</label>
                      <select className="w-full p-2 border rounded-md" onChange={markChanged}>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Appearance</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Color Theme</label>
                      <div className="flex gap-3">
                        {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'].map(color => (
                          <button key={color} className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors" style={{ backgroundColor: color }} onClick={markChanged} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Font Size</label>
                      <select className="w-full p-2 border rounded-md" onChange={markChanged}>
                        <option>Small</option>
                        <option selected>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Language & Region</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Language</label>
                      <select className="w-full p-2 border rounded-md" value={language} onChange={(e) => { setLanguage(e.target.value); markChanged(); }}>
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="japanese">Japanese</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Date Format</label>
                      <select className="w-full p-2 border rounded-md" onChange={markChanged}>
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Number Format</label>
                      <select className="w-full p-2 border rounded-md" onChange={markChanged}>
                        <option>1,234.56</option>
                        <option>1.234,56</option>
                        <option>1 234.56</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button onClick={handleSaveSettings} disabled={!hasChanges}>
                  <Save size={16} className="mr-2" />Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" className="w-full p-2 border rounded-md" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" className="w-full p-2 border rounded-md" value={passwordForm.newPass} onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input type="password" className="w-full p-2 border rounded-md" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
              <Button onClick={handlePasswordChange}>Update Password</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
