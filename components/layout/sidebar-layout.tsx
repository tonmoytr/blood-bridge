"use client";

import { RoleToggle } from "@/components/layout/role-toggle";
import { Badge } from "@/components/ui/badge";
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
    MessageSquare,
    Search,
    Settings,
    Target,
    User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userType: "donor" | "seeker";
}

export function SidebarLayout({ children, userType }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`/api/threads/unread?userId=${userId}&userType=${userType}`);
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [userType]);

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
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200/60 shadow-sm">
          {/* Logo - Enhanced */}
          <Link href="/" className="flex items-center gap-3 px-6 py-6 group hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 group-hover:opacity-20 blur-sm transition-all"></div>
              <Droplet className="h-8 w-8 text-red-600 group-hover:text-red-700 transition-colors relative" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-red-700 transition-all">BloodBridge</span>
          </Link>

          <Separator className="bg-gray-200/50" />

          {/* Role Toggle */}
          <div className="px-4 py-4">
            <RoleToggle />
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === "Messages" && unreadCount > 0 && (
                      <Badge className="bg-red-600 text-white hover:bg-red-700 ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* Bottom Actions */}
          <div className="px-3 py-4 space-y-1">
            <Link href="/profile">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === "/profile" 
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
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
                  "w-full justify-start gap-3 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === "/settings" 
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </Link>

          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200/60 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 group-hover:opacity-20 blur-sm transition-all"></div>
              <Droplet className="h-6 w-6 text-red-600 group-hover:text-red-700 relative transition-colors" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-gray-900">BloodBridge</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 transition-colors">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 transition-colors">
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
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200/60 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-10">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex-col h-14 gap-0.5 px-1 rounded-lg transition-all duration-200 text-xs font-medium relative",
                    isActive 
                      ? "text-red-600 bg-red-50 font-semibold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.label === "Messages" && unreadCount > 0 && (
                    <Badge className="absolute top-1 right-1 h-4 min-w-4 px-1 text-[9px] bg-red-600 text-white hover:bg-red-700">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
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
                "w-full flex-col h-14 gap-0.5 px-1 rounded-lg transition-all duration-200 text-xs font-medium",
                pathname === "/profile" 
                  ? "text-red-600 bg-red-50 font-semibold" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
