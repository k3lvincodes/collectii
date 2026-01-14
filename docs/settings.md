# Settings & Configuration Requirements

This document outlines the settings available to Individual Users and Organizations within the platform.

## 1. Individual User Settings
These settings apply to the personal account of a user.

### 1.1 Profile & Public Info
*   **Avatar**: Upload/Remove profile picture.
*   **Display Name**: Full name visible to others.
*   **Username**: Unique handle for profile URL (e.g., `app.com/u/john`).
*   **Bio/About**: Short description or job title.
*   **Contact Email**: Public-facing email (optional, separate from account email).
*   **Social Links**: LinkedIn, Twitter, GitHub, Website URLs.

### 1.2 Account Security
*   **Email Address**: Change login email (requires verification).
*   **Password**: Update password (current password required).
*   **Two-Factor Authentication (2FA)**: Enable/Disable TOTP (Google Authenticator, Authy).
*   **Active Sessions**: View list of active devices/locations with "Log out other sessions" option.
*   **Delete Account**: Permanent account deletion requests.

### 1.3 Preferences
*   **Theme**: System / Light / Dark / High Contrast.
*   **Language**: Interface language selection.
*   **Timezone**: For notification delivery and timestamp display.
*   **Accessibility**: Reduced motion, font scaling (if not handled by browser).
*   **Start Page**: Choose default dashboard (Personal vs. specific Organization).

### 1.4 Notifications
*   **Email Notifications**:
    *   Marketing/Newsletter (Unsubscribe).
    *   Security Alerts (Always on).
    *   New Team Invitations.
    *   Weekly Digests.
*   **In-App / Push Notifications**:
    *   Mentions (@username).
    *   Task Assignments.
    *   Comments on followed threads.
    *   Team announcements.

### 1.5 Billing (Personal)
*   *Note: If individuals can have paid Pro accounts separate from Orgs.*
*   **Current Plan**: Free / Pro.
*   **Payment Methods**: Manage credit cards.
*   **Billing History**: Download invoices.

---

## 2. Organization Settings
These settings are managed by Organization Owners and Admins.

### 2.1 General Settings
*   **Organization Logo**: Upload/Remove brand asset.
*   **Organization Name**: Display name.
*   **Organization Slug**: URL identifier (e.g., `app.com/acme-corp`).
*   **Industry / Category**: For categorization/reporting.
*   **Company Website**: External link.
*   **Contact Email**: General contact for the org.

### 2.2 Members & Roles
*   **Member List**: View all active members.
*   **Invite Members**: Invite by email or generated link.
*   **Pending Invitations**: View/Revoke sent invites.
*   **Role Management**:
    *   **Owner**: Full access, billing, deletion.
    *   **Admin**: Manage members, settings, integrations.
    *   **Member**: Standard access to authorized resources.
    *   **Guest**: Limited access (specific projects/files only).

### 2.3 Billing & Subscription
*   **Plan Overview**: Current subscription tier, usage limits (seats, storage), next billing date.
*   **Upgrade/Downgrade**: Change plans.
*   **Payment Details**: Manage credit card on file.
*   **Billing Address**: Tax info (VAT/GST ID) and company address for invoices.
*   **Invoices**: History of payments and PDF downloads.
*   **Billing Contacts**: Emails to receive invoice copies.

### 2.4 Privacy & Security
*   **SSO Configuration** (Enterprise): SAML/OIDC settings.
*   **Domain Verification**: Verify ownership of company email domains.
*   **Enforce 2FA**: Require all members to have 2FA enabled.
*   **Session Policy**: Force logout after X days of inactivity.

### 2.5 API & Integrations
*   **API Keys**: Generate/Revoke secret keys for backend access.
*   **Webhooks**: Configure endpoints for event notifications (e.g., `task.created`, `member.added`).
*   **Installed Apps**: Manage third-party integrations (Slack, Discord, GitHub, Zapier).

### 2.6 Data & Exports
*   **Data Export**: Download all organization data (JSON/CSV).
*   **Audit Logs**: View log of administrative actions (who changed what).

### 2.7 Danger Zone
*   **Transfer Ownership**: Move organization ownership to another admin.
*   **Archive Organization**: Read-only mode.
*   **Delete Organization**: Permanent removal of all data and resources.
