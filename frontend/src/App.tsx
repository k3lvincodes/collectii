import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingFallback } from "./components/ui/loading-fallback"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicRoute } from "@/components/PublicRoute"
import { DashboardRedirect } from "@/components/dashboard-redirect"
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from "@/components/ui/toaster"

// Layouts
import AppLayout from './layouts/AppLayout'
import AdminLayout from './layouts/AdminLayout'

// Auth Pages
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'

// App Pages (lazy loaded from migrated Next.js pages)
// TasksPage was previously imported from ./pages/Tasks, updating to ./pages/app/tasks/page
const TasksPage = lazy(() => import('./pages/dashboards/shared/tasks/page'))

// Lazy load dashboard and other heavy pages


const OrganizationDashboardPage = lazy(() => import('./pages/dashboards/organization/page'))
const IndividualDashboardPage = lazy(() => import('./pages/dashboards/individual/page'))
const DynamicDashboard = lazy(() => import('./pages/dashboards/DynamicDashboard'))
const ProjectsPage = lazy(() => import('./pages/dashboards/shared/projects/page'))
const TeamsPage = lazy(() => import('./pages/dashboards/organization/teams/page'))
const AnnouncementsPage = lazy(() => import('./pages/dashboards/organization/announcements/page'))
const MessagesPage = lazy(() => import('./pages/dashboards/shared/messages/page'))
const SettingsPage = lazy(() => import('./pages/dashboards/shared/settings/page'))
const TimeTrackingPage = lazy(() => import('./pages/dashboards/shared/time-tracking/page'))
const ReportsPage = lazy(() => import('./pages/dashboards/shared/reports/page'))

// Marketing Pages
const HomePage = lazy(() => import('./pages/marketing/Home'))
const FeaturesPage = lazy(() => import('./pages/marketing/Features'))
const PricingPage = lazy(() => import('./pages/marketing/Pricing'))
const AboutPage = lazy(() => import('./pages/marketing/About'))

// Admin Pages

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/dashboards/super-admin/page'))
const AdminUsersPage = lazy(() => import('./pages/dashboards/super-admin/users/page'))
const AdminOrganizationsPage = lazy(() => import('./pages/dashboards/super-admin/organizations/page'))
const AdminBillingPage = lazy(() => import('./pages/dashboards/super-admin/billing/page'))
const AdminSettingsPage = lazy(() => import('./pages/dashboards/super-admin/settings/page'))
const AdminAuditsPage = lazy(() => import('./pages/dashboards/super-admin/audits/page'))
const AdminPlaceholderPage = lazy(() => import('./pages/dashboards/super-admin/placeholder'))


function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Marketing Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/about" element={<AboutPage />} />

                        {/* Auth Routes (Public Only) */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<SignInPage />} />
                            <Route path="/sign-in" element={<SignInPage />} />
                            <Route path="/sign-up" element={<SignUpPage />} />
                            <Route path="/get-started" element={<SignUpPage />} />
                        </Route>

                        {/* App Routes (Protected) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/app" element={<AppLayout />}>
                                <Route index element={<DashboardRedirect />} />

                                {/* Dynamic Context Route */}
                                <Route path=":contextSlug" element={<DynamicDashboard />} />

                                {/* Shared Routes (Inherit Context) */}
                                <Route path=":contextSlug/tasks" element={<TasksPage />} />
                                <Route path=":contextSlug/tasks/*" element={<TasksPage />} />
                                <Route path=":contextSlug/projects" element={<ProjectsPage />} />
                                <Route path=":contextSlug/projects/*" element={<ProjectsPage />} />
                                <Route path=":contextSlug/teams" element={<TeamsPage />} />
                                <Route path=":contextSlug/teams/*" element={<TeamsPage />} />
                                <Route path=":contextSlug/announcements" element={<AnnouncementsPage />} />
                                <Route path=":contextSlug/messages" element={<MessagesPage />} />
                                <Route path=":contextSlug/messages/*" element={<MessagesPage />} />
                                <Route path=":contextSlug/settings" element={<SettingsPage />} />
                                <Route path=":contextSlug/settings/*" element={<SettingsPage />} />
                                <Route path=":contextSlug/time-tracking" element={<TimeTrackingPage />} />
                                <Route path=":contextSlug/time-tracking/*" element={<TimeTrackingPage />} />
                                <Route path=":contextSlug/reports" element={<ReportsPage />} />
                                <Route path=":contextSlug/reports/*" element={<ReportsPage />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="users" element={<AdminUsersPage />} />
                                <Route path="users/*" element={<AdminUsersPage />} />
                                <Route path="organizations" element={<AdminOrganizationsPage />} />
                                <Route path="organizations/*" element={<AdminOrganizationsPage />} />
                                <Route path="billing" element={<AdminBillingPage />} />
                                <Route path="billing/*" element={<AdminBillingPage />} />
                                <Route path="settings" element={<AdminSettingsPage />} />
                                <Route path="settings/*" element={<AdminSettingsPage />} />
                                <Route path="audits" element={<AdminAuditsPage />} />
                                <Route path="messages" element={<MessagesPage />} />
                                <Route path="messages/*" element={<MessagesPage />} />
                                <Route path="*" element={<AdminPlaceholderPage />} />
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Router>
            <Toaster />
        </ThemeProvider>
    )
}

export default App
