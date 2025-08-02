import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Database, FileSpreadsheet, Bell, Shield, Brush, Globe, Check } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      duration: 2000,
    });
  };
  
  const settingGroups = [
    { id: 'general', icon: <SettingsIcon size={16} />, label: 'General' },
    { id: 'account', icon: <User size={16} />, label: 'Account' },
    { id: 'data', icon: <Database size={16} />, label: 'Data Management' },
    { id: 'export', icon: <FileSpreadsheet size={16} />, label: 'Export Options' },
    { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
    { id: 'security', icon: <Shield size={16} />, label: 'Security' },
    { id: 'appearance', icon: <Brush size={16} />, label: 'Appearance' },
    { id: 'language', icon: <Globe size={16} />, label: 'Language & Region' },
  ];
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 border-b bg-white">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Customize your Power BI experience</p>
      </div>
      
      <div className="p-6">
        <div className="flex">
          <div className="w-64 mr-8">
            <div className="bg-white border rounded-md overflow-hidden">
              {settingGroups.map((group) => (
                <button
                  key={group.id}
                  className={`w-full flex items-center text-left px-4 py-3 text-sm hover:bg-gray-50 ${activeTab === group.id ? 'bg-gray-50 border-l-4 border-powerbi-primary' : ''}`}
                  onClick={() => setActiveTab(group.id)}
                >
                  <span className={`mr-3 ${activeTab === group.id ? 'text-powerbi-primary' : 'text-gray-500'}`}>
                    {group.icon}
                  </span>
                  <span className={activeTab === group.id ? 'font-medium' : ''}>
                    {group.label}
                  </span>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">User Interface</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Theme</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System Default</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Visualization Default Size</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Medium (600 x 400)</option>
                            <option>Small (400 x 300)</option>
                            <option>Large (800 x 600)</option>
                            <option>Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Editing</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="autosave" 
                            checked={autoSave}
                            onChange={(e) => setAutoSave(e.target.checked)}
                            className="mr-2" 
                          />
                          <label htmlFor="autosave" className="text-sm">Enable auto-save</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="autoformat" 
                            className="mr-2" 
                            defaultChecked
                          />
                          <label htmlFor="autoformat" className="text-sm">Auto-format visualizations</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="snapgrid" 
                            className="mr-2" 
                            defaultChecked
                          />
                          <label htmlFor="snapgrid" className="text-sm">Snap to grid</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Default View</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Start Page</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Home Dashboard</option>
                            <option>Recent Reports</option>
                            <option>Datasets</option>
                            <option>Last Viewed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Report View</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Reading View</option>
                            <option>Editing View</option>
                          </select>
                        </div>
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
                      <div className="w-12 h-12 rounded-full bg-powerbi-primary text-white flex items-center justify-center text-xl font-semibold mr-4">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{userName}</div>
                        <div className="text-sm text-gray-500">{email}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              toast({
                                title: "Photo updated",
                                description: "Your profile photo has been updated successfully.",
                                duration: 2000,
                              });
                            }
                          };
                          input.click();
                        }}
                      >
                        Change Photo
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border rounded-md"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value="Admin"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Workspace</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value="Marketing"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Password Change",
                            description: "Password change dialog would open here with proper authentication.",
                            duration: 3000,
                          });
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Data Management</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data Refresh</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Automatic Refresh Interval</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={dataRefreshInterval}
                            onChange={(e) => setDataRefreshInterval(e.target.value)}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="manual">Manual only</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Refresh Time (for scheduled)</label>
                          <input type="time" className="w-full p-2 border rounded-md" defaultValue="08:00" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Data Storage</label>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Storage Used</span>
                          <span className="text-sm font-medium">1.2 GB of 5 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-powerbi-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Storage Management",
                            description: "Opening storage management panel...",
                            duration: 2000,
                          });
                        }}
                      >
                        Manage Storage
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Connection Defaults</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="encryptconnection" 
                            className="mr-2" 
                            defaultChecked
                          />
                          <label htmlFor="encryptconnection" className="text-sm">Encrypt all data connections</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="cachecreds" 
                            className="mr-2" 
                            defaultChecked
                          />
                          <label htmlFor="cachecreds" className="text-sm">Cache credentials for faster connections</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">In-App Notifications</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="enableNotifications" 
                              checked={notifications}
                              onChange={(e) => setNotifications(e.target.checked)}
                              className="mr-2" 
                            />
                            <label htmlFor="enableNotifications" className="text-sm">Enable in-app notifications</label>
                          </div>
                          {notifications && <Check size={16} className="text-green-500" />}
                        </div>
                        <div className="flex items-center ml-6">
                          <input 
                            type="checkbox" 
                            id="datarefresh" 
                            className="mr-2" 
                            defaultChecked
                            disabled={!notifications}
                          />
                          <label htmlFor="datarefresh" className={`text-sm ${!notifications ? 'text-gray-400' : ''}`}>Data refresh completed</label>
                        </div>
                        <div className="flex items-center ml-6">
                          <input 
                            type="checkbox" 
                            id="reportshared" 
                            className="mr-2" 
                            defaultChecked
                            disabled={!notifications}
                          />
                          <label htmlFor="reportshared" className={`text-sm ${!notifications ? 'text-gray-400' : ''}`}>Report shared with me</label>
                        </div>
                        <div className="flex items-center ml-6">
                          <input 
                            type="checkbox" 
                            id="commentsmention" 
                            className="mr-2" 
                            defaultChecked
                            disabled={!notifications}
                          />
                          <label htmlFor="commentsmention" className={`text-sm ${!notifications ? 'text-gray-400' : ''}`}>Comments and mentions</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Notifications</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="enableEmailNotifications" 
                              checked={emailNotifications}
                              onChange={(e) => setEmailNotifications(e.target.checked)}
                              className="mr-2" 
                            />
                            <label htmlFor="enableEmailNotifications" className="text-sm">Send notifications to my email</label>
                          </div>
                          {emailNotifications && <Check size={16} className="text-green-500" />}
                        </div>
                        <div className="flex items-center ml-6">
                          <input 
                            type="checkbox" 
                            id="datarefreshemail" 
                            className="mr-2" 
                            defaultChecked
                            disabled={!emailNotifications}
                          />
                          <label htmlFor="datarefreshemail" className={`text-sm ${!emailNotifications ? 'text-gray-400' : ''}`}>Data refresh alerts</label>
                        </div>
                        <div className="flex items-center ml-6">
                          <input 
                            type="checkbox" 
                            id="weeklydigest" 
                            className="mr-2" 
                            defaultChecked
                            disabled={!emailNotifications}
                          />
                          <label htmlFor="weeklydigest" className={`text-sm ${!emailNotifications ? 'text-gray-400' : ''}`}>Weekly digest of activities</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'language' && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Language & Region</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Application Language</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="english">English (US)</option>
                          <option value="french">French</option>
                          <option value="spanish">Spanish</option>
                          <option value="german">German</option>
                          <option value="japanese">Japanese</option>
                          <option value="chinese">Chinese (Simplified)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Region Format</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>European Union</option>
                          <option>Japan</option>
                          <option>China</option>
                          <option>India</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date Format</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Number Format</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>1,234.56</option>
                          <option>1.234,56</option>
                          <option>1 234,56</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Currency</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                        <option>CNY (¥)</option>
                        <option>INR (₹)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Time Zone</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option>(UTC+00:00) UTC</option>
                        <option>(UTC+01:00) Central European Time</option>
                        <option>(UTC+08:00) China Standard Time</option>
                        <option>(UTC+09:00) Japan Standard Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 border-t pt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all settings to defaults?')) {
                      alert('Settings reset to defaults');
                    }
                  }}
                >
                  Reset Defaults
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
