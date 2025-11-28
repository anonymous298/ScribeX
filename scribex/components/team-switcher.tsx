"use client"

import * as React from "react"
import { Plus, PlusIcon, PlusSquare } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import Link from "next/link"

export function TeamSwitcher({}) {
  const { isMobile } = useSidebar()
  // const [activeTeam, setActiveTeam] = React.useState(teams[0])

  // if (!activeTeam) {
  //   return null
  // }

  return (
    <SidebarMenu>
      {/* <SidebarMenuItem className='flex justify-start'> 
      
        <Button
          variant={'ghost'}
          size="lg"
          className="bg-accent cursor-pointer "
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <PlusIcon/>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Create Note</span>
          </div>
        </Button>
      </SidebarMenuItem> */}

        <SidebarMenuItem>
          <Button
            variant={'ghost'}
            size="lg"
            className="w-full bg-accent cursor-pointer flex justify-center items-center"
          >
            {/* {item.icon && <item.icon />} */}
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <PlusIcon/>
            </div> */}
            <PlusIcon className="col-span-2"/>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <Link href={'/'} className="w-full text-sm truncate text-foreground">Create Note</Link>
            </div>
          </Button>
        </SidebarMenuItem>
    </SidebarMenu>
  )
}
