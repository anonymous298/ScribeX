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

  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, idx) => (
          <SidebarMenuItem key={idx}>
            <Button
              variant={'ghost'}
              size="lg"
              className="w-full cursor-pointer "
            >
              {item.icon && <item.icon />}

              <div className="grid flex-1 text-left text-sm leading-tight">
                <Link href={item.url} className="w-full text-sm truncate text-foreground" onClick={() => setOpenMobile(false)}>{item.title}</Link>
              </div>
            </Button>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
