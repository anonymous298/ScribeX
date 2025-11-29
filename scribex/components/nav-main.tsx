"use client"

import { ChevronRight, Notebook, PlusIcon, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {

  const { setOpenMobile, open, isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, idx) => (
          <SidebarMenuItem key={idx}>
            <Button
              variant={`${isMobile ? 'outline' : (!isMobile && open) ? 'outline' : 'ghost'}`}
              size="lg"
              className={`w-full justify-start mt-1 ${isMobile ? '' : (!isMobile && open) ? '' : 'p-1'} cursor-pointer `}
            >
                <Link href={item.url} onClick={() => setOpenMobile(false)} className="w-full flex justify-center items-center gap-2">
                  {item.icon && <item.icon />}

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="w-full text-sm truncate text-foreground">{item.title}</span>
                  </div>
                </Link>
            </Button>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
