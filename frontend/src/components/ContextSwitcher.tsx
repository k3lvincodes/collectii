import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Organization {
    id: string;
    name: string;
    logo?: string;
    role: string;
    created_at?: string;
}

interface ContextSwitcherProps {
    userId: string | null;
    currentContext: { type: 'personal' | 'organization'; orgId?: string } | null;
    organizations: Organization[];
    onContextChange: (context: { type: 'personal' | 'organization'; orgId?: string; orgName?: string }) => void;
    onCreateOrg: () => void;
    onOpenChange?: (open: boolean) => void;
    isCollapsed?: boolean;
}

export function ContextSwitcher({ userId, currentContext, organizations, onContextChange, onCreateOrg, onOpenChange, isCollapsed }: ContextSwitcherProps) {
    const currentOrg = currentContext?.type === 'organization'
        ? organizations.find(o => o.id === currentContext.orgId)
        : null;

    const displayName = currentContext?.type === 'personal'
        ? 'Personal'
        : currentOrg?.name || 'Select Workspace';

    return (
        <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`w-full h-auto hover:bg-muted/50 ${isCollapsed ? 'justify-center px-0 py-2' : 'justify-between px-3 py-2'}`}
                >
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        {currentContext?.type === 'personal' ? (
                            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                        ) : (
                            <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                                {currentOrg?.logo ? (
                                    <AvatarImage src={currentOrg.logo} />
                                ) : (
                                    <AvatarFallback className="rounded-lg bg-muted">
                                        <Building2 className="h-4 w-4" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        )}
                        {!isCollapsed && (
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-medium truncate max-w-[120px]">{displayName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {currentContext?.type === 'personal' ? 'Your Workspace' : currentOrg?.role || 'Organization'}
                                </p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "center" : "start"} side={isCollapsed ? "right" : "bottom"} className="w-64 rounded-xl p-2 max-h-[400px] overflow-auto">
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">Workspaces</DropdownMenuLabel>

                {/* Personal Workspace */}
                <DropdownMenuItem
                    className="rounded-lg px-3 py-2 cursor-pointer"
                    onClick={() => onContextChange({ type: 'personal' })}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Personal</p>
                            <p className="text-xs text-muted-foreground">Your private workspace</p>
                        </div>
                    </div>
                </DropdownMenuItem>

                {organizations.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground px-2">Organizations</DropdownMenuLabel>
                        {organizations.map(org => (
                            <DropdownMenuItem
                                key={org.id}
                                className="rounded-lg px-3 py-2 cursor-pointer"
                                onClick={() => onContextChange({ type: 'organization', orgId: org.id, orgName: org.name })}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {org.logo ? (
                                            <AvatarImage src={org.logo} />
                                        ) : (
                                            <AvatarFallback className="rounded-lg bg-muted text-xs">
                                                {org.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[150px]">{org.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{org.role}</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="rounded-lg px-3 py-3 cursor-pointer text-primary hover:text-primary hover:bg-primary/10 font-medium"
                    onClick={onCreateOrg}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
