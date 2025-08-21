import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, X, Mail, Users, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InviteMembersDialogProps {
  trigger?: React.ReactNode;
  workspaceName?: string;
}

export const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({ 
  trigger, 
  workspaceName = "My Workspace" 
}) => {
  const [open, setOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('Viewer');
  const [inviteList, setInviteList] = useState<Array<{email: string, role: string}>>([]);
  const [message, setMessage] = useState('');

  const roles = [
    { value: 'Admin', label: 'Admin', description: 'Full access to workspace' },
    { value: 'Member', label: 'Member', description: 'Can edit content' },
    { value: 'Contributor', label: 'Contributor', description: 'Can create and edit own content' },
    { value: 'Viewer', label: 'Viewer', description: 'Can only view content' }
  ];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const emails = emailInput.split(/[,;\s]+/).filter(email => email.trim());
    const validEmails: Array<{email: string, role: string}> = [];
    const invalidEmails: string[] = [];

    emails.forEach(email => {
      const trimmedEmail = email.trim();
      if (validateEmail(trimmedEmail)) {
        if (!inviteList.some(invite => invite.email === trimmedEmail)) {
          validEmails.push({ email: trimmedEmail, role: selectedRole });
        }
      } else if (trimmedEmail) {
        invalidEmails.push(trimmedEmail);
      }
    });

    if (validEmails.length > 0) {
      setInviteList(prev => [...prev, ...validEmails]);
      setEmailInput('');
      toast({
        title: "Email addresses added",
        description: `Added ${validEmails.length} valid email address(es)`,
      });
    }

    if (invalidEmails.length > 0) {
      toast({
        title: "Invalid email addresses",
        description: `${invalidEmails.join(', ')} are not valid email addresses`,
        variant: "destructive"
      });
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setInviteList(prev => prev.filter(item => item.email !== emailToRemove));
  };

  const updateRole = (email: string, newRole: string) => {
    setInviteList(prev => 
      prev.map(item => 
        item.email === email ? { ...item, role: newRole } : item
      )
    );
  };

  const handleSendInvites = () => {
    if (inviteList.length === 0) {
      toast({
        title: "No invites to send",
        description: "Please add at least one email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending invites
    const invitePromises = inviteList.map(invite => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            email: invite.email,
            role: invite.role,
            status: 'sent'
          });
        }, Math.random() * 1000 + 500);
      })
    );

    Promise.all(invitePromises).then(() => {
      toast({
        title: "Invitations sent successfully",
        description: `Sent ${inviteList.length} invitation(s) to join ${workspaceName}`,
      });

      // Reset form
      setInviteList([]);
      setEmailInput('');
      setMessage('');
      setOpen(false);
    });
  };

  const defaultTrigger = (
    <Button>
      <UserPlus size={16} className="mr-2" />
      Invite Members
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 text-blue-600" size={20} />
            Invite Members to {workspaceName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Email input section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="emails">Email addresses</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="emails"
                  placeholder="Enter email addresses (separate multiple with commas)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEmail} disabled={!emailInput.trim()}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You can enter multiple email addresses separated by commas, semicolons, or spaces
              </p>
            </div>

            {/* Role descriptions */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Shield size={14} className="mr-1" />
                Permission Levels
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {roles.map(role => (
                  <div key={role.value} className="flex flex-col">
                    <span className="font-medium">{role.label}</span>
                    <span className="text-gray-600">{role.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invite list */}
          {inviteList.length > 0 && (
            <div>
              <Label>Pending invitations ({inviteList.length})</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                {inviteList.map((invite, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center flex-1">
                      <Mail size={14} className="mr-2 text-gray-500" />
                      <span className="text-sm">{invite.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={invite.role} 
                        onValueChange={(newRole) => updateRole(invite.email, newRole)}
                      >
                        <SelectTrigger className="w-24 h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmail(invite.email)}
                        className="p-1 h-6 w-6"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal message */}
          <div>
            <Label htmlFor="message">Personal message (optional)</Label>
            <textarea
              id="message"
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Invitation preview */}
          {inviteList.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Invitation Preview</h4>
              <div className="text-sm text-blue-800">
                <p>You've been invited to join the <strong>{workspaceName}</strong> workspace in Power BI.</p>
                {message && (
                  <div className="mt-2 p-2 bg-white rounded border-l-2 border-blue-400">
                    <p className="italic">"{message}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {inviteList.length > 0 && (
              <span>{inviteList.length} invitation(s) ready to send</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvites}
              disabled={inviteList.length === 0}
            >
              Send Invitations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};