"use client";

import { RoleToggle } from "@/components/layout/role-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Bell,
    Clock,
    Droplet,
    FileText,
    Heart,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Search,
    Settings,
    Target,
    User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userType: "donor" | "seeker";
}

export function SidebarLayout({ children, userType }: SidebarLayoutProps) {
  const pathname = usePathname();

  const donorNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/donor" },
    { icon: Search, label: "Find Requests", href: "/donor/requests" },
    { icon: Target, label: "My Missions", href: "/donor/missions" },
    { icon: MessageSquare, label: "Messages", href: "/donor/messages" },
    { icon: Heart, label: "My Donations", href: "/donor/history" },
  ];

  const seekerNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/seeker" },
    { icon: FileText, label: "My Requests", href: "/seeker/requests" },
    { icon: MessageSquare, label: "Messages", href: "/seeker/messages" },
    { icon: Clock, label: "History", href: "/seeker/history" },
  ];

  const navItems = userType === "donor" ? donorNavItems : seekerNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6">
            <Droplet className="h-8 w-8 text-emergency-600" fill="currentColor" />
            <span className="text-2xl font-bold text-gray-900">BloodBridge</span>
          </div>

          <Separator />

          {/* Role Toggle */}
          <div className="px-4 py-4">
            <RoleToggle />
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 text-base",
                      isActive 
                        ? "bg-emergency-600 hover:bg-emergency-700 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* Bottom Actions */}
          <div className="px-4 py-4 space-y-2">
            <Link href="/profile">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === "/profile" 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-700"
                )}
              >
                <User className="h-5 w-5" />
                Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === "/settings" 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-700"
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Droplet className="h-6 w-6 text-emergency-600" fill="currentColor" />
            <span className="text-xl font-bold text-gray-900">BloodBridge</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Role Toggle - Mobile */}
        <div className="px-4 pb-3 flex justify-center">
          <RoleToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex-col h-14 gap-0.5 px-1",
                    isActive ? "text-emergency-600" : "text-gray-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          {/* Profile Button */}
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full flex-col h-14 gap-0.5 px-1",
                pathname === "/profile" ? "text-emergency-600" : "text-gray-600"
              )}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] leading-tight">Profile</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
