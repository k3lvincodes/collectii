-- =============================================================================
-- Collectii Full Database Schema
-- =============================================================================
-- This consolidated schema represents the current state of the database.
-- It integrates all previous migrations and fixes.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. HELPER FUNCTIONS (RLS Fixes)
-- =============================================================================

-- Helper to bypass RLS recursion lookup for organization_members
CREATE OR REPLACE FUNCTION public.get_user_organization_ids(p_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT organization_id
  FROM organization_members
  WHERE user_id = p_user_id;
$$;
GRANT EXECUTE ON FUNCTION public.get_user_organization_ids(uuid) TO authenticated;

-- Helper to check org admin status
CREATE OR REPLACE FUNCTION public.is_org_admin(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE user_id = p_user_id
      AND organization_id = p_org_id
      AND role IN ('owner', 'admin')
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid, uuid) TO authenticated;

-- Helper for org visibility
CREATE OR REPLACE FUNCTION public.user_can_view_org(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE user_id = p_user_id
      AND organization_id = p_org_id
  );
$$;
GRANT EXECUTE ON FUNCTION public.user_can_view_org(uuid, uuid) TO authenticated;

-- Helper for checking general org membership (used for tasks, etc.)
CREATE OR REPLACE FUNCTION public.user_is_org_member(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE user_id = p_user_id
        AND organization_id = p_org_id
  );
$$;
GRANT EXECUTE ON FUNCTION public.user_is_org_member(uuid, uuid) TO authenticated;

-- =============================================================================
-- 2. CORE TABLES
-- =============================================================================

-- Organizations table
CREATE TABLE IF NOT EXISTS custom_organizations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  plan text DEFAULT 'free',
  owner_id uuid, 
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  user_id uuid REFERENCES custom_organizations(id), -- Legacy org reference
  full_name text,
  email text,
  avatar_url text,
  username text UNIQUE, 
  role text DEFAULT 'Member',
  score integer DEFAULT 0,
  status text CHECK (status IN ('online', 'offline', 'away')) DEFAULT 'offline',
  last_seen timestamp with time zone,
  
  -- Extended details
  bio text,
  contact_email text,
  social_links jsonb DEFAULT '{}'::jsonb,

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON COLUMN profiles.bio IS 'Short description or job title';
COMMENT ON COLUMN profiles.contact_email IS 'Public-facing email (optional, separate from account email)';
COMMENT ON COLUMN profiles.social_links IS 'JSON object containing social media URLs (linkedin, twitter, github, website)';

-- Organization members junction table
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner', 'admin', 'manager', 'member')) DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id, user_id)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id),
  name text NOT NULL,
  description text,
  lead_id uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Team members junction table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('member', 'lead')) DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id),
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'dismissed')) DEFAULT 'todo',
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  deadline timestamp with time zone,
  assignee_id uuid REFERENCES profiles(id),
  team_id uuid REFERENCES teams(id),
  estimated_hours int,
  completed_at timestamp with time zone,
  
  -- Enhanced features
  extension_requested_at timestamp with time zone,
  extension_reason text,
  dismissal_reason text,
  deliverables jsonb DEFAULT '[]'::jsonb,

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Task Comments table
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Task Attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  uploader_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  size text,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id),
  author_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  content text NOT NULL,
  "group" text,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id),
  provider text NOT NULL,
  status text CHECK (status IN ('connected', 'disconnected', 'error')) DEFAULT 'disconnected',
  config jsonb DEFAULT '{}'::jsonb,
  connected_at timestamp with time zone
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id uuid REFERENCES profiles(id),
  receiver_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  context_id text,
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES custom_organizations(id) ON DELETE SET NULL,
  clock_in timestamp with time zone NOT NULL,
  clock_out timestamp with time zone,
  break_minutes integer DEFAULT 0,
  notes text,
  location text,
  ip_address text,
  status text CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  inviter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('invite', 'recommendation')) NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  responded_at timestamp with time zone,
  UNIQUE(team_id, invitee_id, status)
);

-- =============================================================================
-- 3. PROJECTS MODULE
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id uuid REFERENCES custom_organizations(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  description text,
  status text CHECK (status IN ('active', 'on_hold', 'completed', 'archived')) DEFAULT 'active',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date timestamp with time zone,
  next_milestone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner', 'manager', 'member', 'viewer')) DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS project_phases (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text CHECK (status IN ('completed', 'in_progress', 'pending')) DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_files (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id),
  name text NOT NULL,
  file_type text,
  size_bytes bigint,
  storage_path text,
  url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE custom_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations (Fixed with recursion helper)
DROP POLICY IF EXISTS "Users can view orgs they belong to" ON custom_organizations;
CREATE POLICY "Users can view orgs they belong to" ON custom_organizations FOR SELECT
USING (
  public.user_can_view_org(auth.uid(), id)
  OR owner_id = auth.uid()
);

DROP POLICY IF EXISTS "Owners can update their org" ON custom_organizations;
CREATE POLICY "Owners can update their org" ON custom_organizations FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can create orgs" ON custom_organizations;
CREATE POLICY "Users can create orgs" ON custom_organizations FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Organization Members (Fixed with recursion helper)
DROP POLICY IF EXISTS "Users can view their org memberships" ON organization_members;
CREATE POLICY "Users can view their org memberships" ON organization_members FOR SELECT
USING (
  user_id = auth.uid()
  OR organization_id IN (SELECT public.get_user_organization_ids(auth.uid()))
);

DROP POLICY IF EXISTS "Admins can add members" ON organization_members;
CREATE POLICY "Admins can add members" ON organization_members FOR INSERT WITH CHECK (public.is_org_admin(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Admins can update members" ON organization_members;
CREATE POLICY "Admins can update members" ON organization_members FOR UPDATE USING (public.is_org_admin(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Admins can remove members" ON organization_members;
CREATE POLICY "Admins can remove members" ON organization_members FOR DELETE USING (public.is_org_admin(auth.uid(), organization_id));

-- Teams
DROP POLICY IF EXISTS "Authenticated users can create teams" ON teams;
CREATE POLICY "Authenticated users can create teams" ON teams FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view teams" ON teams;
CREATE POLICY "Users can view teams" ON teams FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update teams" ON teams;
CREATE POLICY "Users can update teams" ON teams FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can delete teams" ON teams;
CREATE POLICY "Users can delete teams" ON teams FOR DELETE TO authenticated USING (lead_id = auth.uid());

-- Team Members
DROP POLICY IF EXISTS "Authenticated users can view team members" ON team_members;
CREATE POLICY "Authenticated users can view team members" ON team_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert team members" ON team_members;
CREATE POLICY "Authenticated users can insert team members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete team members" ON team_members;
CREATE POLICY "Authenticated users can delete team members" ON team_members FOR DELETE TO authenticated USING (true);

-- Tasks (Fixed)
DROP POLICY IF EXISTS "Users can view tasks" ON tasks;
CREATE POLICY "Users can view tasks" ON tasks FOR SELECT
USING (
  assignee_id = auth.uid()
  OR (organization_id IS NOT NULL AND public.user_is_org_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Users can insert tasks" ON tasks;
CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT
WITH CHECK (
  assignee_id = auth.uid()
  OR (organization_id IS NOT NULL AND public.user_is_org_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Users can update tasks" ON tasks;
CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE
USING (
  assignee_id = auth.uid()
  OR (organization_id IS NOT NULL AND public.user_is_org_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Users can delete tasks" ON tasks;
CREATE POLICY "Users can delete tasks" ON tasks FOR DELETE
USING (
  assignee_id = auth.uid()
  OR (organization_id IS NOT NULL AND public.user_is_org_member(auth.uid(), organization_id))
);

-- Task Comments (Simplified RLS)
DROP POLICY IF EXISTS "Users can view task comments" ON task_comments;
CREATE POLICY "Users can view task comments" ON task_comments FOR SELECT USING (task_id IN (SELECT id FROM tasks));

DROP POLICY IF EXISTS "Users can create task comments" ON task_comments;
CREATE POLICY "Users can create task comments" ON task_comments FOR INSERT WITH CHECK (task_id IN (SELECT id FROM tasks) AND auth.uid() = user_id);

-- Task Attachments (Simplified RLS)
DROP POLICY IF EXISTS "Users can view task attachments" ON task_attachments;
CREATE POLICY "Users can view task attachments" ON task_attachments FOR SELECT USING (task_id IN (SELECT id FROM tasks));

DROP POLICY IF EXISTS "Users can upload task attachments" ON task_attachments;
CREATE POLICY "Users can upload task attachments" ON task_attachments FOR INSERT WITH CHECK (task_id IN (SELECT id FROM tasks) AND auth.uid() = uploader_id);

-- Announcements & Integrations (Updated to use new helper)
DROP POLICY IF EXISTS "Users can view announcements in their organization" ON announcements;
CREATE POLICY "Users can view announcements in their organization" ON announcements FOR SELECT
USING (public.user_is_org_member(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Users can manage announcements in their organization" ON announcements;
CREATE POLICY "Users can manage announcements in their organization" ON announcements FOR ALL
USING (public.user_is_org_member(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Users can view integrations in their organization" ON integrations;
CREATE POLICY "Users can view integrations in their organization" ON integrations FOR SELECT
USING (public.user_is_org_member(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Users can manage integrations in their organization" ON integrations;
CREATE POLICY "Users can manage integrations in their organization" ON integrations FOR ALL
USING (public.user_is_org_member(auth.uid(), organization_id));

-- Messages
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update received messages" ON messages;
CREATE POLICY "Users can update received messages" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Notes
DROP POLICY IF EXISTS "Users can manage their own notes" ON notes;
CREATE POLICY "Users can manage their own notes" ON notes FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Time Entries
DROP POLICY IF EXISTS "Users can view own time entries" ON time_entries;
CREATE POLICY "Users can view own time entries" ON time_entries FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own time entries" ON time_entries;
CREATE POLICY "Users can create own time entries" ON time_entries FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own time entries" ON time_entries;
CREATE POLICY "Users can update own time entries" ON time_entries FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own time entries" ON time_entries;
CREATE POLICY "Users can delete own time entries" ON time_entries FOR DELETE USING (user_id = auth.uid());

-- Projects
DROP POLICY IF EXISTS "Users can view projects they belong to" ON projects;
CREATE POLICY "Users can view projects they belong to" ON projects FOR SELECT
USING (owner_id = auth.uid() OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can manage projects" ON projects;
CREATE POLICY "Owners can manage projects" ON projects FOR ALL USING (owner_id = auth.uid());

-- Project Members
DROP POLICY IF EXISTS "Users can view project memberships" ON project_members;
CREATE POLICY "Users can view project memberships" ON project_members FOR SELECT
USING (user_id = auth.uid() OR project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));

DROP POLICY IF EXISTS "Project owners can manage members" ON project_members;
CREATE POLICY "Project owners can manage members" ON project_members FOR ALL
USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));

-- Project Phases
DROP POLICY IF EXISTS "Users can view phases of their projects" ON project_phases;
CREATE POLICY "Users can view phases of their projects" ON project_phases FOR SELECT
USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid() UNION SELECT project_id FROM project_members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Project owners can manage phases" ON project_phases;
CREATE POLICY "Project owners can manage phases" ON project_phases FOR ALL
USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));

-- Project Files
DROP POLICY IF EXISTS "Users can view files of their projects" ON project_files;
CREATE POLICY "Users can view files of their projects" ON project_files FOR SELECT
USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid() UNION SELECT project_id FROM project_members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Project members can upload files" ON project_files;
CREATE POLICY "Project members can upload files" ON project_files FOR INSERT
WITH CHECK (uploaded_by = auth.uid() AND project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid() UNION SELECT project_id FROM project_members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "File uploaders can manage their files" ON project_files;
CREATE POLICY "File uploaders can manage their files" ON project_files FOR ALL USING (uploaded_by = auth.uid());

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
CREATE POLICY "Authenticated users can create notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Team Invitations
DROP POLICY IF EXISTS "Users can view invitations" ON team_invitations;
CREATE POLICY "Users can view invitations" ON team_invitations FOR SELECT TO authenticated
USING (inviter_id = auth.uid() OR invitee_id = auth.uid() OR team_id IN (SELECT id FROM teams WHERE lead_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create invitations" ON team_invitations;
CREATE POLICY "Authenticated users can create invitations" ON team_invitations FOR INSERT TO authenticated WITH CHECK (inviter_id = auth.uid());

DROP POLICY IF EXISTS "Invitees can update invitations" ON team_invitations;
CREATE POLICY "Invitees can update invitations" ON team_invitations FOR UPDATE TO authenticated
USING (invitee_id = auth.uid() OR team_id IN (SELECT id FROM teams WHERE lead_id = auth.uid()));

-- =============================================================================
-- 6. INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_context_id ON messages(context_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_clock_in ON time_entries(clock_in);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_project ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);

-- Notifications & Invitations Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee ON team_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);

-- =============================================================================
-- 7. TRIGGERS
-- =============================================================================

-- Handle new user signup - create profile automatically (Robust version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    avatar_url, 
    username, 
    role, 
    status
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    new.raw_user_meta_data->>'avatar_url',
    NULL,
    'Member',
    'offline'
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RAISE; 
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================================================
-- 8. REALTIME SETUP
-- =============================================================================

DO $$
BEGIN
  -- Messages
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  -- Notifications
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;

  -- Team Invitations
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'team_invitations') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE team_invitations;
  END IF;

  -- Task Comments
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'task_comments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
  END IF;

  -- Task Attachments
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'task_attachments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE task_attachments;
  END IF;
END $$;
