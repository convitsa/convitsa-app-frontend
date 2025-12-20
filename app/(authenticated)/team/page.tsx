'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Mail,
  MoreVertical,
  Shield,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  RefreshCw,
  Activity,
  Plus,
  Building2,
  ChevronDown,
  Settings,
  Key,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import {
  useListTeamsQuery,
  useListTeamMembersQuery,
  useListRolesQuery,
  useInviteTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useResendInvitationMutation,
  useUpdateTeamMutation,
  useSwitchTeamMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetTeamActivityQuery,
  type TeamMember,
  type CustomRole,
  type IPermissions,
} from '@/lib/store/api/teamsApi';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentTeamId, selectCurrentTeam, selectTeams } from '@/lib/store/slices/authSlice';
import { useToast } from '@/lib/store/hooks/useToast';

// Default permissions structure matching backend
const DEFAULT_PERMISSIONS: IPermissions = {
  domains: { view: true, create: false, edit: false, delete: false, verify: false },
  prompts: { view: true, create: false, edit: false, delete: false, analyze: false },
  analytics: { view_web: true, view_llm: true, export: false },
  content: { view: true, generate: false, edit: false, delete: false },
  team: { invite: false, remove: false, edit_roles: false },
  billing: { view: false, manage: false },
};

// Permission categories for UI display
const permissionCategories = [
  {
    key: 'domains',
    label: 'Domains',
    permissions: [
      { key: 'view', label: 'View Domains' },
      { key: 'create', label: 'Create Domains' },
      { key: 'edit', label: 'Edit Domains' },
      { key: 'delete', label: 'Delete Domains' },
      { key: 'verify', label: 'Verify Domains' },
    ],
  },
  {
    key: 'prompts',
    label: 'Prompts',
    permissions: [
      { key: 'view', label: 'View Prompts' },
      { key: 'create', label: 'Create Prompts' },
      { key: 'edit', label: 'Edit Prompts' },
      { key: 'delete', label: 'Delete Prompts' },
      { key: 'analyze', label: 'Analyze Prompts' },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    permissions: [
      { key: 'view_web', label: 'View Web Analytics' },
      { key: 'view_llm', label: 'View LLM Analytics' },
      { key: 'export', label: 'Export Analytics' },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    permissions: [
      { key: 'view', label: 'View Content' },
      { key: 'generate', label: 'Generate Content' },
      { key: 'edit', label: 'Edit Content' },
      { key: 'delete', label: 'Delete Content' },
    ],
  },
  {
    key: 'team',
    label: 'Team',
    permissions: [
      { key: 'invite', label: 'Invite Members' },
      { key: 'remove', label: 'Remove Members' },
      { key: 'edit_roles', label: 'Edit Roles' },
    ],
  },
  {
    key: 'billing',
    label: 'Billing',
    permissions: [
      { key: 'view', label: 'View Billing' },
      { key: 'manage', label: 'Manage Billing' },
    ],
  },
];

export default function TeamPage() {
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const currentTeamId = useAppSelector(selectCurrentTeamId);
  const currentTeam = useAppSelector(selectCurrentTeam);
  const teams = useAppSelector(selectTeams);

  // API Queries
  const { refetch: refetchTeams } = useListTeamsQuery();
  const { data: membersData, isLoading: isLoadingMembers } = useListTeamMembersQuery(currentTeamId || '', {
    skip: !currentTeamId,
  });
  const { data: rolesData, isLoading: isLoadingRoles } = useListRolesQuery(currentTeamId || '', {
    skip: !currentTeamId,
  });
  const { data: activityData, isLoading: isLoadingActivity } = useGetTeamActivityQuery(
    { teamId: currentTeamId || '', limit: 10 },
    { skip: !currentTeamId }
  );

  // Mutations
  const [inviteMember, { isLoading: isInviting }] = useInviteTeamMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveTeamMemberMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
  const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateTeamMutation();
  const [switchTeam, { isLoading: isSwitching }] = useSwitchTeamMutation();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();

  const members = membersData?.data?.members || [];
  const allRoles = rolesData?.data?.roles || [];
  const customRoles = allRoles.filter((r) => !r.isDefault);
  const defaultRoles = allRoles.filter((r) => r.isDefault);

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);

  // Form data
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState({ email: '', role: 'member', customRoleId: '' });
  const [editTeamName, setEditTeamName] = useState('');
  const [roleData, setRoleData] = useState<{
    name: string;
    description: string;
    permissions: IPermissions;
  }>({
    name: '',
    description: '',
    permissions: { ...DEFAULT_PERMISSIONS },
  });

  // Active tab for settings
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'settings'>('members');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-green-100 text-green-700';
      case 'viewer':
        return 'bg-gray-100 text-gray-700';
      case 'custom':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatLastActive = (date?: Date | string) => {
    if (!date) return 'Never';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = Date.now() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Team Handlers
  const handleUpdateTeam = async () => {
    if (!editTeamName.trim() || !currentTeamId) return;

    try {
      await updateTeam({ teamId: currentTeamId, name: editTeamName }).unwrap();
      setShowEditTeamModal(false);
      showSuccess('Team updated successfully!');
      refetchTeams();
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to update team');
    }
  };

  const handleSwitchTeam = async (teamId: string) => {
    try {
      await switchTeam(teamId).unwrap();
      setShowTeamSwitcher(false);
      showSuccess('Switched team successfully');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to switch team');
    }
  };

  // Member Handlers
  const handleInvite = async () => {
    if (!inviteData.email || !currentTeamId) return;

    try {
      // Determine if it's a default role or custom role
      const isCustomRole = inviteData.customRoleId && inviteData.role === 'custom';
      
      await inviteMember({
        teamId: currentTeamId,
        email: inviteData.email,
        role: isCustomRole ? undefined : inviteData.role,
        customRoleId: isCustomRole ? inviteData.customRoleId : undefined,
      }).unwrap();

      setShowInviteModal(false);
      setInviteData({ email: '', role: 'member', customRoleId: '' });
      showSuccess('Invitation sent!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to send invitation');
    }
  };

  const handleUpdateRole = async (role: string) => {
    if (!selectedMember || !currentTeamId) return;

    try {
      // Use user.id from the member object
      await updateMember({
        teamId: currentTeamId,
        userId: selectedMember.user.id,
        role,
      }).unwrap();

      setShowEditMemberModal(false);
      showSuccess('Role updated!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to update role');
    }
  };

  const handleUpdateRoleWithCustom = async (customRoleId: string) => {
    if (!selectedMember || !currentTeamId) return;

    try {
      await updateMember({
        teamId: currentTeamId,
        userId: selectedMember.user.id,
        customRoleId,
      }).unwrap();

      setShowEditMemberModal(false);
      showSuccess('Role updated!');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember || !currentTeamId) return;

    try {
      // Use user.id from the member object
      await removeMember({
        teamId: currentTeamId,
        userId: selectedMember.user.id,
      }).unwrap();

      setShowDeleteMemberModal(false);
      showInfo('Team member removed');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to remove member');
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    if (!currentTeamId) return;

    try {
      await resendInvitation({
        teamId: currentTeamId,
        userId: member.user.id,
      }).unwrap();
      showSuccess(`Invitation resent to ${member.user?.email}`);
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to resend invitation');
    }
  };

  const handleCancelInvite = async (member: TeamMember) => {
    if (!currentTeamId) return;

    try {
      await removeMember({
        teamId: currentTeamId,
        userId: member.user.id,
      }).unwrap();

      showInfo('Invitation cancelled');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to cancel invitation');
    }
  };

  // Role Handlers
  const handleCreateOrUpdateRole = async () => {
    if (!roleData.name.trim() || !currentTeamId) return;

    try {
      if (selectedRole && selectedRole.id) {
        await updateRole({
          teamId: currentTeamId,
          roleId: selectedRole.id,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
        }).unwrap();
        showSuccess('Role updated!');
      } else {
        await createRole({
          teamId: currentTeamId,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
        }).unwrap();
        showSuccess('Role created!');
      }
      setShowRoleModal(false);
      resetRoleForm();
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole?.id || !currentTeamId) return;

    try {
      await deleteRole({
        teamId: currentTeamId,
        roleId: selectedRole.id,
      }).unwrap();
      setShowDeleteRoleModal(false);
      showInfo('Role deleted');
    } catch (err: any) {
      showError(err?.data?.error?.message || 'Failed to delete role');
    }
  };

  const resetRoleForm = () => {
    setSelectedRole(null);
    setRoleData({
      name: '',
      description: '',
      permissions: { ...DEFAULT_PERMISSIONS },
    });
  };

  const openEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setRoleData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
    });
    setShowRoleModal(true);
  };

  const togglePermission = (categoryKey: string, permKey: string) => {
    setRoleData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [categoryKey]: {
          ...prev.permissions[categoryKey as keyof IPermissions],
          [permKey]: !prev.permissions[categoryKey as keyof IPermissions][permKey as keyof (typeof prev.permissions)[keyof IPermissions]],
        },
      },
    }));
  };

  // Count active permissions for a role
  const countActivePermissions = (permissions: IPermissions): number => {
    let count = 0;
    Object.values(permissions).forEach((category) => {
      Object.values(category).forEach((value) => {
        if (value) count++;
      });
    });
    return count;
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          {/* Team Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTeamSwitcher(!showTeamSwitcher)}
              className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                {currentTeam?.name?.charAt(0)?.toUpperCase() || 'T'}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">{currentTeam?.name || 'Select Team'}</p>
                <p className="text-xs text-gray-500">{members.length} members</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTeamSwitcher ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTeamSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Your Teams</div>
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleSwitchTeam(team.id)}
                      disabled={isSwitching}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors ${
                        team.id === currentTeamId ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary-light flex items-center justify-center text-white font-bold text-sm">
                        {team.name?.charAt(0)?.toUpperCase() || 'T'}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 text-sm">{team.name}</p>
                      </div>
                      {team.id === currentTeamId && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-500 mt-1">Manage team members, roles, and permissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => {
              setEditTeamName(currentTeam?.name || '');
              setShowEditTeamModal(true);
            }}
          >
            Settings
          </Button>
          <Button
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowInviteModal(true)}
          >
            Invite Member
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 border-b border-gray-200"
      >
        {[
          { id: 'members', label: 'Members', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: Key },
          { id: 'settings', label: 'Team Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <p className="text-sm text-gray-500">{members.length} members</p>
              </div>
            </div>

            {isLoadingMembers ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No team members yet. Invite your first member!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                              {member.user?.firstName?.charAt(0) || member.user?.email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.user?.firstName || ''} {member.user?.lastName || ''}
                              </p>
                              <p className="text-sm text-gray-500">{member.user?.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(member.role)}`}>
                            {member.role === 'owner' && <Shield className="w-3 h-3 mr-1" />}
                            {member.role === 'custom' && member.customRoleName ? member.customRoleName : member.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {member.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <Check className="w-4 h-4" />
                              Active
                            </span>
                          ) : member.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600">
                              <X className="w-4 h-4" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {member.joinedAt ? formatLastActive(member.joinedAt) : 'Pending'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {member.status === 'pending' ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<RefreshCw className="w-4 h-4" />}
                                  onClick={() => handleResendInvite(member)}
                                  isLoading={isResending}
                                >
                                  Resend
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  leftIcon={<X className="w-4 h-4" />}
                                  onClick={() => handleCancelInvite(member)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : member.role !== 'owner' ? (
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                                {activeDropdown === member.id && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                                    <button
                                      onClick={() => {
                                        setSelectedMember(member);
                                        setShowEditMemberModal(true);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit Role
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedMember(member);
                                        setShowDeleteMemberModal(true);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 px-2">Owner</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-500">Team member actions</p>
                </div>
              </div>

              {isLoadingActivity ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : !activityData?.data?.activities || activityData.data.activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No activity yet</p>
                  <p className="text-sm text-gray-400">Team actions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityData.data.activities.map((activity) => {
                    const userName = `${activity.user?.firstName || ''} ${activity.user?.lastName || ''}`.trim() || activity.user?.email || 'Unknown';
                    const userInitial = activity.user?.firstName?.charAt(0) || activity.user?.email?.charAt(0)?.toUpperCase() || '?';
                    return (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-sm font-semibold text-white">
                          {userInitial}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-gray-900">{userName}</span>{' '}
                            <span className="text-gray-500">{activity.action}</span>
                          </p>
                          <p className="text-xs text-gray-400">{formatLastActive(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-100">
                  <Key className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Roles & Permissions</h2>
                  <p className="text-sm text-gray-500">Manage custom roles for your team</p>
                </div>
              </div>
              <Button
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  resetRoleForm();
                  setShowRoleModal(true);
                }}
              >
                Create Role
              </Button>
            </div>

            {/* Default Roles */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Default Roles</h3>
              <div className="space-y-2">
                {defaultRoles.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleBadgeColor(role.name)}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{role.name}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">System role</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Roles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Custom Roles</h3>
              {isLoadingRoles ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : customRoles.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <Key className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No custom roles yet.</p>
                  <p className="text-sm text-gray-400">Create a custom role to define specific permissions.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customRoles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{role.name}</p>
                          <p className="text-sm text-gray-500">
                            {role.description || `${countActivePermissions(role.permissions)} permissions enabled`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditRole(role)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowDeleteRoleModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Team Info */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team Information</h2>
                <p className="text-sm text-gray-500">Basic team settings</p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <div className="flex gap-2">
                  <Input
                    value={editTeamName || currentTeam?.name || ''}
                    onChange={(e) => setEditTeamName(e.target.value)}
                    placeholder="Team name"
                  />
                  <Button
                    onClick={handleUpdateTeam}
                    isLoading={isUpdatingTeam}
                    disabled={!editTeamName.trim() || editTeamName === currentTeam?.name}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            value={inviteData.email}
            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Default Roles (except owner) */}
              {defaultRoles.filter((r) => r.name !== 'owner').map((role) => {
                const isSelected = inviteData.role === role.name && !inviteData.customRoleId;
                return (
                  <label
                    key={role.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invite-role"
                      checked={isSelected}
                      onChange={() => setInviteData({ ...inviteData, role: role.name, customRoleId: '' })}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{role.name}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                  </label>
                );
              })}
              
              {/* Custom Roles */}
              {customRoles.length > 0 && (
                <>
                  <div className="text-xs font-semibold text-gray-400 uppercase pt-2">Custom Roles</div>
                  {customRoles.map((role) => {
                    const isSelected = inviteData.role === 'custom' && inviteData.customRoleId === role.id;
                    return (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="invite-role"
                          checked={isSelected}
                          onChange={() => setInviteData({ ...inviteData, role: 'custom', customRoleId: role.id || '' })}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{role.name}</p>
                          <p className="text-xs text-gray-500">
                            {role.description || `${countActivePermissions(role.permissions)} permissions`}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleInvite} isLoading={isInviting}>
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Role Modal */}
      <Modal isOpen={showEditMemberModal} onClose={() => setShowEditMemberModal(false)} title="Edit Member Role">
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {selectedMember.user?.firstName?.charAt(0) || selectedMember.user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedMember.user?.firstName} {selectedMember.user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedMember.user?.email}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Default Roles (except owner) */}
              {defaultRoles.filter((r) => r.name !== 'owner').map((role) => {
                const isCurrentRole = selectedMember.role === role.name;
                return (
                  <button
                    key={role.name}
                    onClick={() => handleUpdateRole(role.name)}
                    disabled={isUpdating}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                      isCurrentRole ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{role.name}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                    {isCurrentRole && <Check className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
              
              {/* Custom Roles */}
              {customRoles.length > 0 && (
                <>
                  <div className="text-xs font-semibold text-gray-400 uppercase pt-2">Custom Roles</div>
                  {customRoles.map((role) => {
                    const isCurrentRole = selectedMember.role === 'custom' && selectedMember.customRoleId === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleUpdateRoleWithCustom(role.id || '')}
                        disabled={isUpdating}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                          isCurrentRole ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{role.name}</p>
                          <p className="text-xs text-gray-500">
                            {role.description || `${countActivePermissions(role.permissions)} permissions`}
                          </p>
                        </div>
                        {isCurrentRole && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Member Modal */}
      <Modal isOpen={showDeleteMemberModal} onClose={() => setShowDeleteMemberModal(false)} title="Remove Team Member">
        {selectedMember && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to remove{' '}
              <span className="font-semibold">
                {selectedMember.user?.firstName} {selectedMember.user?.lastName}
              </span>{' '}
              from the team? They will lose access immediately.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteMemberModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleRemoveMember} isLoading={isRemoving}>
                Remove Member
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Team Modal */}
      <Modal isOpen={showEditTeamModal} onClose={() => setShowEditTeamModal(false)} title="Team Settings">
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="Team name"
            leftIcon={<Building2 className="w-5 h-5" />}
            value={editTeamName}
            onChange={(e) => setEditTeamName(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowEditTeamModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleUpdateTeam} isLoading={isUpdatingTeam}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          resetRoleForm();
        }}
        title={selectedRole ? 'Edit Role' : 'Create Custom Role'}
      >
        <div className="space-y-4">
          <Input
            label="Role Name"
            placeholder="e.g., Content Manager"
            value={roleData.name}
            onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description of this role"
            value={roleData.description}
            onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {permissionCategories.map((category) => (
                <div key={category.key}>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{category.label}</p>
                  <div className="space-y-1">
                    {category.permissions.map((perm) => {
                      const categoryPerms = roleData.permissions[category.key as keyof IPermissions];
                      const isChecked = categoryPerms ? (categoryPerms as any)[perm.key] : false;
                      return (
                        <label
                          key={perm.key}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked ? 'bg-primary/10' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(category.key, perm.key)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowRoleModal(false);
                resetRoleForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateOrUpdateRole}
              isLoading={isCreatingRole || isUpdatingRole}
            >
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Role Modal */}
      <Modal isOpen={showDeleteRoleModal} onClose={() => setShowDeleteRoleModal(false)} title="Delete Role">
        {selectedRole && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the <span className="font-semibold">{selectedRole.name}</span> role?
            </p>
            <p className="text-sm text-gray-500">
              Members with this role will need to be reassigned to a different role.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteRoleModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteRole}
                isLoading={isDeletingRole}
              >
                Delete Role
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
