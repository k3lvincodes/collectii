# Web Application Structure

This document outlines the detailed functional and design specifications for the Collectii web application. Each key page is described in depth to ensure clarity on functionality, user experience, and intended behavior.

## 1. User Architecture & Multi-Tenancy Model

### Core Principle: Individual-First Design
Every user signs up as an **individual** first. Upon registration, each user automatically receives:
- A personal profile
- Access to their **Personal (Individual) Dashboard**
- The ability to use the app for personal productivity immediately

### Organization Creation & Ownership
From their personal dashboard, users can choose to create **one or more organizations** at any time:
- When a user creates an organization, they automatically become the **Owner/Admin** of that organization
- Owners have full control over the organization: inviting members, managing roles, billing, settings, etc.
- A single user can own multiple organizations (e.g., a consultant managing different client businesses)
- Users can also be **invited** to other organizations as members (not owners)

### Dashboard Switching
The app provides seamless switching between contexts:
- **Personal Dashboard**: Always available. The user's individual workspace for personal tasks, time tracking, and private productivity.
- **Organization Dashboard(s)**: One per organization the user owns or belongs to. Each has its own isolated data, team, projects, and settings.

### Context Switcher UI
A **Context Switcher** component in the sidebar/header allows users to:
1. View their personal workspace
2. View a list of organizations they own or belong to
3. Instantly switch between any of these contexts
4. Create a new organization directly from the switcher

### Role Hierarchy
Within each organization:
| Role | Description |
|------|-------------|
| **Owner** | Full control. Can delete org, manage billing, transfer ownership. |
| **Admin** | Can manage members, projects, settings. Cannot delete org or manage billing. |
| **Manager** | Can oversee teams, assign tasks, view reports. |
| **Member** | Standard contributor. Can execute tasks and participate in projects. |

### Data Isolation
- Personal data (individual tasks, notes, time logs) is **private** and never visible to organizations.
- Organization data is isolated per-organization. A user in Org A cannot see Org B's data unless they belong to both.
- Super Admin dashboard provides platform-wide oversight but respects privacy boundaries.

---

## 2. Individual Dashboard
**Base Route**: `/individual`

Designed for individual workers, freelancers, and employees to execute work, track progress, and manage their personal productivity ecosystem.

### Core Landing Page: Individual Overview
**Route**: `/individual/page.tsx`

The **Individual Overview** acts as the command center for the user's daily operations. It is designed to answer the immediate questions: "What do I need to do right now?", "How am I performing?", and "What did I miss?". The layout is composed of a modular grid system that prioritizes actionable information over static data.

**Key Functional Areas:**
1.  **Welcome & Status Header**: The top section greets the user specifically by name and displays their current work status (Online, Away, Do Not Disturb, or Clocked In/Out status if time tracking is active). A prominent "Quick Date" widget allows users to toggle between today's view and upcoming days to plan ahead.
2.  **Performance Scorecard**: A central feature of Collectii is accountability. This widget displays the user's current "Performance Score" (e.g., a dynamic rating out of 100 or 5.0). It breaks down *why* the score is what it is—citing "On-time completions," "Activity consistency," and "Peer reviews." It uses color-coded trends (green arrows for improvement, red for decline) to give instant feedback.
3.  **Critical Task Stream**: Unlike a generic task list, this section filters strictly for "High Priority" and "Due Soon" items. It shows the top 3-5 tasks that require immediate attention. Each card allows for "One-Click Status Updates" (e.g., Mark as Done, Request Extension) without leaving the dashboard.
4.  **Activity Timeline**: A vertical feed on the right side captures the pulse of work. It logs recent events such as "Project Manager commented on Task A," "File uploaded to Project B," or "System Alert: Performance Score updated." This ensures the user never misses context.
5.  **Personal Quick Notes**: A scratchpad area that persists locally or to the user's private DB record. It's for ephemeral thoughts like "Call client at 3 PM" or "Double check the API key." It supports rich text and checklists but is deliberately kept simple to encourage rapid capture.

---

### Tasks Module (Unified)
**Route**: `/tasks`

The **Tasks Module** is the execution engine of the application. We have consolidated what would traditionally be disparate pages (My Tasks, Drafts, Archives) into a single, powerful, tabbed interface. This reduces page loads and keeps the user in flow.

**Functionality & Design:**
*   **Smart Tabs System**: The top navigation within the page switches views instantly.
    *   **"My Active Tasks"**: The default view. It shows everything currently assigned to the user that is not completed. Users can sort this by "Deadline (Ascending)" (default), "Priority," or "Project." The list view provides rich metadata columns: Due Date, Project Tag, Priority Badge (High/Med/Low), and a Progress Bar for sub-tasks.
    *   **"Assigned by Others"**: A specific view for work delegated *to* the user versus self-created tasks. This helps distinguish external obligations from internal organization.
    *   **"Review Pipeline"**: For tasks that the user has completed but are awaiting approval from a manager. This transparency prevents the "I thought I finished that" confusion.
    *   **"Drafts & Templates"**: Users can create task skeletons here. If a user frequently performs the same "Weekly Report" task, they can store it as a template and instantiate it with one click.
*   **Task Detail Drawer**: Clicking any task row does not open a new page; instead, it slides out a comprehensive "Task Drawer" from the right. This drawer contains the description, deliverables, file attachments, and a dedicated comment thread for that specific task. This "context-in-place" design allows users to reference the main list while working on details.
*   **Filtering Engine**: A robust sidebar filter allows complex queries like "Show me tasks from Project Alpha that are High Priority and Due this week."

---

### Projects Module (Unified)
**Route**: `/projects`

The **Projects Module** shifts the focus from "what *I* need to do" to "what *we* are building." It provides a macro view of collaborative efforts.

**Functionality & Design:**
*   **Project Cards Grid**: The main view presents projects as rich cards. Each card acts as a mini-dashboard for that project, displaying a cover image (or color code), the project lead's avatar, a progress circle (e.g., "75% Completed"), and a "Next Milestone" indicator.
*   **Tabbed Project Views**:
    *   **"Active"**: Projects currently in flight.
    *   **"Timeline/Gantt"**: A visual roadmap view. This is crucial for understanding dependencies. Users can see how their tasks block others or are blocked by others.
    *   **"File Repository"**: A unified file manager view that aggregates every attachment from every task within the selected projects. This saves users from hunting through chat logs to find "that one PDF."
*   **Milestone Tracker**: A dedicated sub-view tracks major deliverables. It separates the day-to-day grind from the big picture goals. Users can clearly see "Phase 1: Foundation" is marked Complete, while "Phase 2: Implementation" is marked In Progress with a target date.
*   **Team Access**: Users can quickly see who else is on the project and initiate a group chat or direct message immediately from the project members list. This bridges the gap between execution and communication.

---

### Time Tracking Module (Unified)
**Route**: `/time-tracking`

This module is not just a punch clock; it is a **productivity analytics suite** for the individual. It empowers the user to prove their work and understand their own habits.

**Functionality & Design:**
*   **The Time Clock**: A prominent, impossible-to-miss widget for "Clock In," "Start Break," and "Clock Out." It features a running timer and calculates "Time Worked Today" in real-time. It includes geolocation or IP tagging if the organization requires it for remote work validation.
*   **Timesheet Grid**: A structured table view of the week. Rows represent days, columns represent "Base Hours," "Overtime," "Breaks," and "Total." Users can manually edit entries here (if permissions allow) to correct mistakes, but every edit creates an audit log for transparency.
*   **Productivity Stats**: This tab visualizes the user's work patterns. Graphs show "Most Productive Hours" (e.g., "You complete 40% of tasks between 9 AM and 11 AM") and "Focus Time vs. Distraction."
*   **Export & Reports**: Users can generate a PDF or CSV report of their own hours for personal record-keeping or invoicing. This self-service model reduces the burden on HR/Admins to pull reports for individuals.

---

### Messages Module (Unified)
**Route**: `/messages`

The **Messages Module** consolidates all communication into a single interface, replacing the fragmented "chat sidebar" with a full-screen, focused communication experience. This is critical for deep work and organized discussion.

**Functionality & Design:**
*   **Three-Pane Layout**: The standard refined chat layout. 
    *   **Left Pane (Navigation)**: Filters for "Direct Messages," "Group/Team Chats," and "Project Channels." It supports "Pinned" conversations for frequent contacts and visual badges for unread counts.
    *   **Middle Pane (Conversation)**: The active chat stream. It supports rich text, code snippets, inline image previews, and "Reply threads." Threading is essential to keep the main channel clean.
    *   **Right Pane (Context)**: This is the superpower. When chatting with "Project Alpha Team," this pane shows the "Project Alpha" summary, upcoming deadlines, and pinned files. When chatting with a person, it shows their profile, local time, and shared tasks.
*   **Task Integration**: Users can turn a message directly into a task. Hovering over a message like "Can you fix the header?" reveals a "Create Task" button, which instantly pre-fills a task creation form with the message content. This linkage stops requests from getting lost in chat history.

---

## 3. Organization Dashboard
**Base Route**: `/organization`

Designed for Department Heads, Managers, and Business Owners. This dashboard focuses on **oversight, resource allocation, and macro-level performance**.

### Core Landing Page: Organization Overview
**Route**: `/organization/page.tsx`

The **Organization Overview** provides the "God View" of the company's operational health. It aggregates data from all disparate sources into high-level metrics.

**Key Functional Areas:**
*   **Health Pulse**: Top-level KPIs such as "Total Active Projects," "Tasks Due Today," "Team Availability (Online/Offline count)," and "Average Organization Productivity Score." 
*   **Department Leaderboard**: A comparative widget showing which departments are clearing tasks fastest and which are falling behind. This gamification fosters healthy competition and highlights areas needing support.
*   **Urgent & Critical Alerts**: A "War Room" style feed that surfaces only the most critical issues: "Project X is 3 days overdue," "Department Y has 5 unscheduled shifts," or "Server Capacity at 90%."
*   **Resource Availability**: A heatmap or capacity bar chart showing how utilized the workforce is. It quickly answers "Can we take on a new client?" by visually showing if the team is at 100% capacity or has slack.

---

### Team Management Module
**Route**: `/teams`

This module is the HR and administrative backbone of the organization within the platform.

**Functionality & Design:**
*   **Member Directory**: A searchable, filterable card view of every employee. Cards display name, role, department, and current "Performance Score." Admins can bulk-select members to "Send Announcement," "Assign to Project," or "Suspend Access."
*   **Role-Based Access Control (RBAC) View**: A dedicated tab for defining what "Managers" can do vs. "Contributors." This allows granular control over data privacy (e.g., "Can Contributors see other people's tasks?").
*   **Department Structure**: A visual organizational chart builder. Admins can drag-and-drop users into departments (e.g., Engineering, Sales). This structure dictates task routing and reporting hierarchies.
*   **Activity Monitoring**: A specialized log for managers to audit work. It is not a spy tool but a verification tool. It shows "User X completed Task Y at 2:00 PM." This granularity is key for the platform's "Accountability" promise.

---

### Tasks & Projects Modules (Organization Views)
**Routes**: `/tasks`, `/projects` (Org variations)

While similar in name to the Individual modules, the **Organization Views** offer radically different controls.

**Functionality & Design:**
*   **Global Task Registry**: Instead of "My Tasks," this view allows managers to see *all* tasks across the entire company. The filtering power here is immense: "Show me all 'High Priority' tasks in 'Marketing' assigned to 'John Doe' that are 'Overdue'."
*   **Bulk Assignment Tools**: Managers can select 50 tasks and reassign them from "Employee A" to "Employee B" in one click (e.g., if Employee A is sick).
*   **Project Portfolio Management**: The Projects view adds financial or resource budgeting layers. Managers can set "Project Value" or "Estimated Hours" and track "Actual vs. Planned" burn rates.
*   **Risk Analysis**: A predictive view that flags projects likely to miss deadlines based on current velocity. It uses historical completion rates to warn: "At current pace, Project Z will be 2 weeks late."

---

### Reports Center
**Route**: `/reports`

The **Reports Center** is where data becomes decision-making power. It aggregates millions of data points into digestible insights.

**Functionality & Design:**
*   **Report Builder Wizard**: Users can choose a template (e.g., "Weekly Productivity," "Project Costing") or build a custom report by selecting metrics (Tasks Completed, Hours Logged, Errors Reported) and a time range.
*   **Team Performance Analytics**: Detailed scatter plots comparing "Speed of Execution" vs. "Quality/Rating." This helps identify "Fast but careless" workers vs. "Slow but perfectionist" workers.
*   **Automated Scheduling**: Managers can set up "Recurring Reports." Example: "Email me the 'Sales Team Activity Report' every Friday at 5 PM."
*   **Exportability**: All data is exportable to CSV/Excel for external modeling, and PDF for boardroom presentations.

---

### Messages Module (Organization View)
**Route**: `/messages`

The **Organization Messages Module** mirrors the functionality of the Individual module but adds oversight and broadcast capabilities.

**Functionality & Design:**
*   **Broadcast Channels**: Special "Announcement" channels that are read-only for most staff but writable for admins. Used for "Company All hands" updates or policy changes.
*   **Department Channels**: Auto-generated groups based on the structural hierarchy (e.g., everyone in "Sales" is automatically in `#sales-general`).
*   **Moderation Tools**: Admins (depending on privacy settings and local laws) may have access to flag handling or audit logs for compliance in communication.

---

## 4. Super Admin Dashboard
**Base Route**: `/admin`

Designed for the Platform Owner/Operator. This is not about managing a team; it's about managing the SaaS platform itself.

### Super Admin Dashboard Overview
**Route**: `/admin/page.tsx`

This page is the "Pulse of the Product." It focuses on growth, stability, and revenue.

**Key Functional Areas:**
*   **Growth Metrics**: Big number cards for "Total Registered Users," "Active Organizations," "New Signups Today," and "churn Rate."
*   **System Health**: Real-time traffic lights for "Database Latency," "API Uptime," and "Storage Capacity." If the server is struggling, this dashboard turns red.
*   **Revenue Snapshot**: A daily ticker of "MRR (Monthly Recurring Revenue)" and "Gross Transaction Volume."
*   **Global Alerts**: System-wide warnings, such as "Stripe API Connectivity Error" or "Spike in Error Logs."

---

### User & Organization Management Modules
**Routes**: `/admin/users`, `/admin/organizations`

**Functionality & Design:**
*   **Global User Registry**: Access to the record of every human on the platform. Admins can "Impersonate" a user (log in as them) to debug issues (with strict logging), force password resets, or permanently ban bad actors.
*   **Organization Lifecycle**: Tools to "Approve" new company signups (if manual vetting is required), "Upgrade/Downgrade" subscription tiers manually, or "Terminate" an organization's access for non-payment.
*   **Verification Queues**: A workflow interface for processing "Identity Verification" or "Business Documents" uploaded by users. Admins can view documents side-by-side with the user profile and click "Approve" or "Reject with Reason."

---

### Billing & Subscriptions Module
**Route**: `/admin/billing`

**Functionality & Design:**
*   **Transaction Logs**: A ledger of every payment attempt, successful or failed. This is crucial for support tickets ("Why did my card fail?").
*   **Plan Configuration**: A UI for defining the SaaS pricing strategy. Admins can create new "Gold Plan" tiers, set limits (e.g., "Max 10 Users"), and update prices without deploying code.
*   **Invoice Repository**: Searchable archive of all generated PDF invoices for compliance and tax auditing.

---

### Platform Settings & Audits
**Routes**: `/admin/settings`, `/admin/audits`

**Functionality & Design:**
*   **Feature Flags**: A toggle board to enable/disable features globally or for specific segments. Example: Turn on "Beta: AI Assistant" only for "Internal Staff."
*   **Security Configuration**: Settings for "Password Complexity Requirements," "Session Timeout Durations," and "2FA Enforcement policies."
*   **The "Black Box" (Audit Trails)**: An immutable, searchable log of every administrative action taken on the platform. "Who deleted this Org?", "Who changed the pricing?". This is the ultimate source of truth for security investigations.

