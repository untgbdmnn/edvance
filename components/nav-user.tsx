"use client"

import {
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import useAuthStore from "@/lib/authStore"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export function NavUser() {
  const router = useRouter()
  const logOut = useAuthStore.getState().clearAuth;

  const handleLogout = () => {
    logOut()
    Cookies.remove('edvance-auth')
    router.push('/sign-in')
  }

  const { isMobile } = useSidebar()
  const dataUser = useAuthStore.getState().user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage />
                <AvatarFallback className="rounded-lg">{getInitials(dataUser?.name!)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{dataUser?.name}</span>
                <span className="truncate text-xs">{dataUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage />
                  <AvatarFallback className="rounded-lg">{getInitials(dataUser?.name!)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{dataUser?.name}</span>
                  <span className="truncate text-xs">{dataUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ToggleTheme />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleTheme() {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {theme === 'dark' ? <BsMoonStarsFill /> : <BsSunFill />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <BsMoonStarsFill /> Dark Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <BsSunFill /> Light Mode
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getInitials(input: string): string {
  const words = input.split(' ');

  const firstInitial = words[0].charAt(0).toUpperCase();

  const secondInitial = words.length > 1 ? words[1].charAt(0).toUpperCase() : '';

  return `${firstInitial}${secondInitial}`;
}