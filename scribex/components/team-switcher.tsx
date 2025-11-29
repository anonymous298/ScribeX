"use client"

import * as React from "react"
import { HomeIcon, Loader2Icon, Plus, PlusIcon, PlusSquare } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { createNote } from "@/server/actions/note.action"
import toast from "react-hot-toast"
import { getCurrentUserDbId } from "@/server/actions/user.action"
import { IconDashboard } from "@tabler/icons-react"

export function TeamSwitcher({}) {
  const { isMobile, setOpenMobile, open } = useSidebar()
  const [isCreating, setIsCreating] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [formValues, setFormValues] = React.useState({
    title: "",
    content: ""
  })

  // console.log(isMobile)
  // console.log(formValues)
  // const [activeTeam, setActiveTeam] = React.useState(teams[0])

  // if (!activeTeam) {
  //   return null
  // }

  const handleCreateNote = async () => {
    try {
      setIsCreating(true)
      
      const current = await getCurrentUserDbId()

      const result = await createNote(formValues.title, formValues.content);

      if (result?.success) {
        setFormValues({
          title: "",
          content: ""
        });

        toast.success("Note Created Successfully...")
        setOpenMobile(false)
        setIsOpen(false)

        // Force Load to show changes ToDo: Temperory in future I will add State Management to show changes on the spot
        window.location.reload()

      }

      else {
        toast.error(`Error Creating Note ${current}`)
      }


    } catch (error) {
      console.log("Error occured while creating the note", error)
      throw new Error("Error while creating the note")
    } finally {
      setIsCreating(false)
    }
  }

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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger 
              asChild
            >
              <Button 
                variant={`${isMobile ? 'default' : (!isMobile && open) ? 'default' : 'ghost'}`}
                className="w-full cursor-pointer flex justify-center items-center"
              >

                <PlusIcon className="col-span-2 size-4"/>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="w-full text-sm truncate text-secondary font-bold">Create Note</span>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Create Note</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title: </Label>
                  <Input 
                    name="title"
                    value={formValues.title}
                    id="title" 
                    type="email" 
                    placeholder="Enter your title..." 
                    required 
                    onChange={(e) => setFormValues({...formValues, [e.target.name] : e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Content: </Label>
                  <Textarea 
                    name="content"
                    value={formValues.content}
                    id="content" 
                    placeholder="Enter your content..." 
                    className="w-full h-40"
                    onChange={(e) => setFormValues({...formValues, [e.target.name] : e.target.value})}
                    
                  />

                </div>

                {/* For Future Updates */}
                {/* <div>
                  Tags
                </div> */}

              </div>

              <DialogFooter className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
                <DialogClose asChild>
                  <Button variant={'outline'}>Cancel</Button>
                </DialogClose>

                <Button
                  className="cursor-pointer"
                  onClick={handleCreateNote}
                  disabled={isCreating || !formValues.title.trim()}
                >
                  {isCreating ? 
                    <>
                      <Loader2Icon className="animate-spin"/>
                      Creating
                    </>
                    :
                    <>
                      Create
                    </>}
                </Button>
              </DialogFooter>
            </DialogContent>

          </Dialog>
          
        </SidebarMenuItem>

        <SidebarMenuItem>

          <Button 
            variant={'ghost'}
            className={`w-full ${isMobile ? 'bg-secondary' : (!isMobile && open) ? 'bg-secondary' : ''}  cursor-pointer flex justify-center items-center mt-1`}
          >

            <IconDashboard className="col-span-2 size-4"/>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <Link href={'/dashboard'} className="w-full text-sm truncate font-bold" onClick={() => setOpenMobile(false)}>Dashboard</Link>
            </div>
          </Button>
        </SidebarMenuItem>

        <SidebarMenuItem>

          <Button 
            variant={'ghost'}
            className={`w-full ${isMobile ? 'bg-secondary' : (!isMobile && open) ? 'bg-secondary' : ''}  cursor-pointer flex justify-center items-center mt-1`}
          >

            <Link href={'/'} onClick={() => setOpenMobile(false)} className="w-full flex justify-center items-center gap-2">
              <HomeIcon className="col-span-2 size-4"/>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="w-full text-sm truncate font-bold">Home</span>
              </div>
            </Link>
          </Button>
        </SidebarMenuItem>

    </SidebarMenu>
  )
}
