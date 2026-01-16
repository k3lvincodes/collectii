import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AppHeader } from "@/components/app-header"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { UsernameSetupModal } from "@/components/modals/UsernameSetupModal"

export default function AdminLayout() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [needsUsername, setNeedsUsername] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function getUserData() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single()
                setProfile(profile)

                if (!profile?.username) {
                    setNeedsUsername(true)
                }
            }
        }
        getUserData()
    }, [])

    const handleUsernameSuccess = (newUsername: string) => {
        setProfile((prev: any) => ({ ...prev, username: newUsername }))
        setNeedsUsername(false)
    }

    return (
        <SidebarProvider>
            <AdminSidebar user={user} />
            <div className="flex flex-col flex-1 overflow-hidden md:pl-20">
                <AppHeader
                    accountType="super_admin"
                    user={user}
                    currentContext={{ type: 'personal' }}
                    currentSlug="admin"
                    organizations={[]}
                    onContextChange={() => { }}
                    onCreateOrg={() => { }}
                />
                <main className="flex-1 overflow-auto bg-background">
                    <Outlet />
                </main>
            </div>

            {/* Username Enforcement Modal */}
            <UsernameSetupModal
                open={needsUsername}
                user={user}
                onSuccess={handleUsernameSuccess}
            />
        </SidebarProvider>
    )
}
