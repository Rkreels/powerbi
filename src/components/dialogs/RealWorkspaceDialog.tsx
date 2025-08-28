import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Users, Settings, Crown, Shield, Eye, Lock, Globe, 
  UserPlus, Mail, Copy, Trash2, Edit3, MoreVertical
} from "lucide-react";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Contributor' | 'Viewer';
  avatar?: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
}

const SAMPLE_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Member',
    lastActive: '1 day ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'Contributor',
    lastActive: '3 days ago',
    status: 'pending'
  }
];

interface RealWorkspaceDialogProps {
  trigger?: React.ReactNode;
  mode?: 'create' | 'manage';
  workspaceId?: string;
}

export const RealWorkspaceDialog: React.FC<RealWorkspaceDialogProps> = ({ 
  trigger, 
  mode = 'create',
  workspaceId 
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private' as 'private' | 'public',
    defaultRole: 'Member' as Member['role']
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Member['role']>('Member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Workspace name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      if (mode === 'create') {
        const newWorkspace = dataService.createWorkspace({
          name: formData.name,
          description: formData.description,
          members: 1,
          isDefault: false
        });

        toast({
          title: "Success",
          description: `Workspace "${newWorkspace.name}" created successfully`,
        });
      } else {
        toast({
          title: "Success",
          description: "Workspace settings updated successfully",
        });
      }

      setOpen(false);
      setFormData({ name: '', description: '', visibility: 'private', defaultRole: 'Member' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workspace",
        variant: "destructive"
      });
    }
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Email address is required",
        variant: "destructive"
      });
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Never',
      status: 'pending'
    };

    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
    
    toast({
      title: "Invitation sent",
      description: `Invited ${inviteEmail} as ${inviteRole}`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast({
      title: "Member removed",
      description: "Member has been removed from workspace",
    });
  };

  const handleRoleChange = (memberId: string, newRole: Member['role']) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast({
      title: "Role updated",
      description: `Member role changed to ${newRole}`,
    });
  };

  const getRoleIcon = (role: Member['role']) => {
    switch (role) {
      case 'Admin': return <Crown size={16} className="text-yellow-500" />;
      case 'Member': return <Users size={16} className="text-blue-500" />;
      case 'Contributor': return <Edit3 size={16} className="text-green-500" />;
      case 'Viewer': return <Eye size={16} className="text-gray-500" />;
      default: return <Users size={16} />;
    }
  };

  const getStatusBadge = (status: Member['status']) => {
    switch (status) {
      case 'active': return <Badge variant="secondary" className="text-green-600 bg-green-50">Active</Badge>;
      case 'pending': return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Pending</Badge>;
      case 'inactive': return <Badge variant="secondary" className="text-gray-600 bg-gray-50">Inactive</Badge>;
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Plus size={16} className="mr-2" />
      {mode === 'create' ? 'Create Workspace' : 'Manage Workspace'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Workspace' : 'Manage Workspace'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Workspace Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workspace name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter workspace description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={formData.visibility} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <Lock size={16} className="mr-2" />
                        Private - Only invited members
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe size={16} className="mr-2" />
                        Public - Anyone in organization
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {mode === 'create' ? 'Create Workspace' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Workspace Members</h3>
              <Badge variant="outline">{members.length} members</Badge>
            </div>

            {/* Invite new member */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <UserPlus size={16} className="mr-2" />
                  Invite Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                    />
                  </div>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Member['role'])}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Contributor">Contributor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInviteMember}>
                    <Mail size={16} className="mr-2" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members list */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                          <div className="text-xs text-gray-400">Last active: {member.lastActive}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(member.status)}
                        
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span className="text-sm">{member.role}</span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'Admin')}>
                              Change to Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'Member')}>
                              Change to Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'Viewer')}>
                              Change to Viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Default Member Role</CardTitle>
                  <CardDescription>
                    Role assigned to new members by default
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={formData.defaultRole} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, defaultRole: value as Member['role'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Contributor">Contributor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for this workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Copy size={16} className="mr-2" />
                    Duplicate Workspace
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 size={16} className="mr-2" />
                    Delete Workspace
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};