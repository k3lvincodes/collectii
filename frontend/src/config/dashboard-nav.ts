import {
    Home,
    ListTodo,
    Mail,
    Users,
    BarChart3,
    Megaphone,
    Settings,
    FolderKanban,
    Clock,
    Bell,
    User,
    Building2,
    CreditCard,
    Shield,
    FileText,
    UserCog,
    Calendar,
    Star,
    Archive,
    FileCheck,
    FileEdit,
    Inbox,
    ClipboardList,
    Activity,
    TrendingUp,
    Briefcase,
    FolderOpen,
    UsersRound,
    Target,
    BarChart4,
    LucideIcon,
} from 'lucide-react';

export interface NavItem {
    href: string;
    icon: LucideIcon;
    label: string;
    badge?: string;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

// ========================================
// INDIVIDUAL ACCOUNT NAVIGATION
// ========================================

// ========================================
// INDIVIDUAL ACCOUNT NAVIGATION
// ========================================

export const individualNavSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { href: '/app/individual', icon: Home, label: 'Overview' },
            { href: '/app/individual/recent-tasks', icon: ClipboardList, label: 'Recent Tasks' },
            { href: '/app/individual/activity', icon: Activity, label: 'Activity Timeline' },
            { href: '/app/individual/schedule', icon: Calendar, label: "Today's Schedule" },
            { href: '/app/individual/progress', icon: TrendingUp, label: 'Task Progress' },
            { href: '/app/individual/notes', icon: FileEdit, label: 'Quick Notes' },
            { href: '/app/individual/assigned', icon: Inbox, label: 'Assigned by Others' },
            { href: '/app/individual/reminders', icon: Bell, label: 'Reminders' },
        ],
    },
    {
        title: 'Tasks',
        items: [
            { href: '/app/tasks', icon: ListTodo, label: 'All Tasks' },
            { href: '/app/tasks/my-tasks', icon: User, label: 'My Tasks' },
            { href: '/app/tasks/completed', icon: FileCheck, label: 'Completed' },
            { href: '/app/tasks/pending', icon: Clock, label: 'Pending' },
            { href: '/app/tasks/draft', icon: FileEdit, label: 'Draft' },
            { href: '/app/tasks/favorite', icon: Star, label: 'Favorite' },
            { href: '/app/tasks/archived', icon: Archive, label: 'Archived' },
            { href: '/app/tasks/templates', icon: ClipboardList, label: 'Templates' },
        ],
    },
    {
        title: 'Projects',
        items: [
            { href: '/app/projects', icon: FolderKanban, label: 'All Projects' },
            { href: '/app/projects/active', icon: Briefcase, label: 'Active Projects' },
            { href: '/app/projects/completed', icon: FileCheck, label: 'Completed' },
            { href: '/app/projects/timeline', icon: Calendar, label: 'Timeline' },
            { href: '/app/projects/files', icon: FolderOpen, label: 'Files' },
            { href: '/app/projects/members', icon: UsersRound, label: 'Members' },
            { href: '/app/projects/milestones', icon: Target, label: 'Milestones' },
            { href: '/app/projects/reports', icon: FileText, label: 'Reports' },
        ],
    },
    {
        title: 'Time Tracking',
        items: [
            { href: '/app/time-tracking', icon: Clock, label: 'Clock In/Out' },
            { href: '/app/time-tracking/hours', icon: Activity, label: 'Work Hours' },
            { href: '/app/time-tracking/timesheet', icon: ClipboardList, label: 'Timesheet' },
            { href: '/app/time-tracking/productivity', icon: TrendingUp, label: 'Productivity' },
            { href: '/app/time-tracking/breaks', icon: Clock, label: 'Break Logs' },
            { href: '/app/time-tracking/weekly', icon: Calendar, label: 'Weekly Breakdown' },
            { href: '/app/time-tracking/monthly', icon: Calendar, label: 'Monthly Breakdown' },
            { href: '/app/time-tracking/export', icon: FileText, label: 'Export' },
        ],
    },

];

// ========================================
// ORGANIZATION ACCOUNT NAVIGATION
// ========================================

export const organizationNavSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { href: '/app/organization', icon: Home, label: 'Team Overview' },
            { href: '/app/organization/projects', icon: FolderKanban, label: 'Running Projects' },
            { href: '/app/organization/distribution', icon: BarChart3, label: 'Task Distribution' },
            { href: '/app/organization/performance', icon: TrendingUp, label: 'Team Performance' },
            { href: '/app/organization/departments', icon: Building2, label: 'Departments' },
            { href: '/app/organization/workload', icon: BarChart4, label: 'Workload Heatmap' },
            { href: '/app/organization/daily-summary', icon: Calendar, label: 'Daily Summary' },
            { href: '/app/organization/analytics', icon: BarChart3, label: 'Analytics' },
        ],
    },
    {
        title: 'Team Management',
        items: [
            { href: '/app/teams', icon: Users, label: 'All Members' },
            { href: '/app/teams/add', icon: UserCog, label: 'Add/Remove' },
            { href: '/app/teams/roles', icon: Shield, label: 'Roles & Permissions' },
            { href: '/app/teams/departments', icon: Building2, label: 'Departments' },
            { href: '/app/teams/activity', icon: Activity, label: 'Activity Monitoring' },
            { href: '/app/teams/performance', icon: TrendingUp, label: 'Performance Stats' },
            { href: '/app/teams/workload', icon: BarChart3, label: 'Workload Assignment' },
            { href: '/app/teams/invite', icon: Mail, label: 'Invite Members' },
        ],
    },
    {
        title: 'Tasks',
        items: [
            { href: '/app/tasks', icon: ListTodo, label: 'All Tasks' },
            { href: '/app/tasks/assigned', icon: UserCog, label: 'Assigned Tasks' },
            { href: '/app/tasks/team', icon: Users, label: 'Team Tasks' },
            { href: '/app/tasks/department', icon: Building2, label: 'Department Tasks' },
            { href: '/app/tasks/urgent', icon: Bell, label: 'Urgent' },
            { href: '/app/tasks/recurring', icon: Clock, label: 'Recurring' },
            { href: '/app/tasks/templates', icon: ClipboardList, label: 'Templates' },
            { href: '/app/tasks/analytics', icon: BarChart3, label: 'Analytics' },
        ],
    },
    {
        title: 'Projects',
        items: [
            { href: '/app/projects', icon: FolderKanban, label: 'All Projects' },
            { href: '/app/projects/departments', icon: Building2, label: 'By Department' },
            { href: '/app/projects/leaders', icon: UserCog, label: 'Project Leaders' },
            { href: '/app/projects/resources', icon: Briefcase, label: 'Resource Allocation' },
            { href: '/app/projects/files', icon: FolderOpen, label: 'Project Files' },
            { href: '/app/projects/milestones', icon: Target, label: 'Milestones' },
            { href: '/app/projects/gantt', icon: Calendar, label: 'Gantt View' },
            { href: '/app/projects/risk', icon: Shield, label: 'Risk Analysis' },
        ],
    },
    {
        title: 'Time Tracking',
        items: [
            { href: '/app/time-tracking', icon: Clock, label: 'Company Timesheet' },
            { href: '/app/time-tracking/members', icon: Users, label: 'Member Timesheets' },
            { href: '/app/time-tracking/overtime', icon: Activity, label: 'Overtime' },
            { href: '/app/time-tracking/hours', icon: Clock, label: 'Work Hours' },
            { href: '/app/time-tracking/late-early', icon: Bell, label: 'Late/Early Logs' },
            { href: '/app/time-tracking/attendance', icon: Calendar, label: 'Attendance' },
            { href: '/app/time-tracking/export', icon: FileText, label: 'Export Reports' },
            { href: '/app/time-tracking/payroll', icon: CreditCard, label: 'Payroll Integration' },
        ],
    },
    {
        title: 'Reports & Analytics',
        items: [
            { href: '/app/reports', icon: BarChart3, label: 'All Reports' },
            { href: '/app/reports/team', icon: Users, label: 'Team Reports' },
            { href: '/app/reports/projects', icon: FolderKanban, label: 'Project Reports' },
            { href: '/app/reports/time', icon: Clock, label: 'Time Reports' },
            { href: '/app/announcements', icon: Megaphone, label: 'Announcements' },
        ],
    },
];

// ========================================
// SUPER ADMIN NAVIGATION
// ========================================

export const adminNavSections: NavSection[] = [
    {
        title: 'Platform Overview',
        items: [
            { href: '/admin', icon: Home, label: 'Dashboard' },
            { href: '/admin/users-stats', icon: Users, label: 'Total Users' },
            { href: '/admin/organizations-stats', icon: Building2, label: 'Total Organizations' },
            { href: '/admin/subscriptions', icon: CreditCard, label: 'Active Subscriptions' },
            { href: '/admin/system-health', icon: Activity, label: 'System Health' },
            { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
            { href: '/admin/errors', icon: Shield, label: 'Error Logs' },
            { href: '/admin/activity', icon: Activity, label: 'Recent Activities' },
        ],
    },
    {
        title: 'User Management',
        items: [
            { href: '/admin/users', icon: Users, label: 'All Users' },
            { href: '/admin/users/suspend', icon: Shield, label: 'Suspend/Ban' },
            { href: '/admin/users/verify', icon: FileCheck, label: 'Verify Accounts' },
            { href: '/admin/users/search', icon: User, label: 'Search Users' },
            { href: '/admin/users/reset', icon: Settings, label: 'Reset Password' },
            { href: '/admin/users/activity', icon: Activity, label: 'Activity Logs' },
            { href: '/admin/users/reports', icon: FileText, label: 'User Reports' },
            { href: '/admin/users/export', icon: FileText, label: 'Export Users' },
        ],
    },
    {
        title: 'Organization Management',
        items: [
            { href: '/admin/organizations', icon: Building2, label: 'All Organizations' },
            { href: '/admin/organizations/create', icon: Building2, label: 'Create Org' },
            { href: '/admin/organizations/verify', icon: FileCheck, label: 'Verify Business' },
            { href: '/admin/organizations/pending', icon: Clock, label: 'Pending Approvals' },
            { href: '/admin/organizations/billing', icon: CreditCard, label: 'Org Billing' },
            { href: '/admin/organizations/activity', icon: Activity, label: 'Activity Logs' },
            { href: '/admin/organizations/subscriptions', icon: CreditCard, label: 'Subscriptions' },
            { href: '/admin/organizations/terminate', icon: Shield, label: 'Terminate Org' },
        ],
    },
    {
        title: 'Billing & Subscriptions',
        items: [
            { href: '/admin/billing', icon: CreditCard, label: 'Payment Logs' },
            { href: '/admin/billing/plans', icon: FileText, label: 'Active Plans' },
            { href: '/admin/billing/revenue', icon: TrendingUp, label: 'Revenue Dashboard' },
            { href: '/admin/billing/invoices', icon: FileText, label: 'Invoices' },
            { href: '/admin/billing/refunds', icon: CreditCard, label: 'Refunded Payments' },
            { href: '/admin/billing/failed', icon: Shield, label: 'Failed Payments' },
            { href: '/admin/billing/promo', icon: Star, label: 'Promo Codes' },
            { href: '/admin/billing/pricing', icon: Settings, label: 'Pricing Settings' },
        ],
    },
    {
        title: 'Platform Settings',
        items: [
            { href: '/admin/settings', icon: Settings, label: 'System Config' },
            { href: '/admin/settings/api', icon: Shield, label: 'API Keys' },
            { href: '/admin/settings/integrations', icon: Briefcase, label: 'Integrations' },
            { href: '/admin/settings/email', icon: Mail, label: 'Email Settings' },
            { href: '/admin/settings/notifications', icon: Bell, label: 'Notifications' },
            { href: '/admin/settings/storage', icon: FolderOpen, label: 'Storage' },
            { href: '/admin/settings/security', icon: Shield, label: 'Security Config' },
            { href: '/admin/settings/data-retention', icon: Archive, label: 'Data Retention' },
        ],
    },
    {
        title: 'Audits & Compliance',
        items: [
            { href: '/admin/audits', icon: FileText, label: 'Full Activity Logs' },
            { href: '/admin/audits/access', icon: Shield, label: 'Access Logs' },
            { href: '/admin/audits/security', icon: Shield, label: 'Security Events' },
            { href: '/admin/audits/gdpr', icon: FileCheck, label: 'GDPR Tools' },
            { href: '/admin/audits/export', icon: FileText, label: 'Data Export' },
            { href: '/admin/audits/backup', icon: Archive, label: 'Data Backup' },
            { href: '/admin/audits/restore', icon: Activity, label: 'Restore Points' },
            { href: '/admin/audits/trail', icon: Activity, label: 'Audit Trail' },
        ],
    },
];

// ========================================
// SHARED MESSAGING NAVIGATION
// ========================================

export const messagingNavigation: NavItem[] = [
    { href: '/app/messages', icon: Mail, label: 'All Messages' },
    { href: '/app/messages/direct', icon: User, label: 'Direct Messages' },
    { href: '/app/messages/groups', icon: Users, label: 'Group Chats' },
    { href: '/app/messages/projects', icon: FolderKanban, label: 'Project Discussions' },
    { href: '/app/messages/tasks', icon: ListTodo, label: 'Task Comments' },
    { href: '/app/messages/unread', icon: Bell, label: 'Unread' },
    { href: '/app/messages/pinned', icon: Star, label: 'Pinned' },
    { href: '/app/messages/settings', icon: Settings, label: 'Settings' },
];

// ========================================
// ACCOUNT & SETTINGS (Shared)
// ========================================

export const accountSettingsNavigation: NavItem[] = [
    { href: '/app/settings', icon: Settings, label: 'Profile' },
    { href: '/app/settings/preferences', icon: User, label: 'Preferences' },
    { href: '/app/settings/security', icon: Shield, label: 'Password & Security' },
    { href: '/app/settings/devices', icon: Activity, label: 'Connected Devices' },
    { href: '/app/settings/integrations', icon: Briefcase, label: 'Integrations' },
    { href: '/app/settings/theme', icon: Settings, label: 'Theme & Display' },
    { href: '/app/settings/billing', icon: CreditCard, label: 'Billing' },
    { href: '/app/settings/delete', icon: Archive, label: 'Delete Account' },
];

export const individualSettingsNavigation: NavItem[] = [
    { href: 'profile', icon: User, label: 'Profile & Public Info' },
    { href: 'security', icon: Shield, label: 'Account Security' },
    { href: 'preferences', icon: Settings, label: 'Preferences' },
    { href: 'notifications', icon: Bell, label: 'Notifications' },
    { href: 'billing', icon: CreditCard, label: 'Billing' },
];

export const organizationSettingsNavigation: NavItem[] = [
    { href: 'general', icon: Building2, label: 'General Settings' },
    { href: 'members', icon: Users, label: 'Members & Roles' },
    { href: 'billing', icon: CreditCard, label: 'Billing & Subscription' },
    { href: 'security', icon: Shield, label: 'Privacy & Security' },
    { href: 'integrations', icon: Briefcase, label: 'API & Integrations' },
    { href: 'data', icon: Archive, label: 'Data & Exports' },
    { href: 'danger', icon: Activity, label: 'Danger Zone' },
];
