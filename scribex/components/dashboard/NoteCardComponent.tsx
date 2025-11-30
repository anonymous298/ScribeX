"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { deleteNote, getAllNotes, toggleStarredNote, updateNote } from "@/server/actions/note.action";
import SpotlightCard from "../SpotlightCard";
import { formatDistanceToNow } from 'date-fns'
import { DotSquare, Loader2Icon, Star } from "lucide-react";
import toast, { ToastIcon } from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NoteCardSkeleton } from "./NoteCardSkeleton";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CreateNoteButtonForMainPage from "./CreateNoteButtonForMainPage";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tag } from "@/app/generated/prisma/enums";

type Note = {
  id: string;
  author_id: string;
  title: string;
  tag: string | null;
  starred: boolean;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function ExpandableCardDemo() {


  const tagColors: Record<Tag, string> = {
    WORK: "bg-gradient-to-r from-red-400 to-red-600 text-white",
    PERSONAL: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    STUDY: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
    IDEAS: "bg-gradient-to-r from-lime-400 to-emerald-500 text-white",
    OTHER: "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
  };


  const [active, setActive] = useState<Note | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [isNotesNotPresent, setIsNotesNotPresent] = useState(true)

  const [currentSelectedNoteForEdit, setCurrentSelectedNoteForEdit] = useState<Note>()
  const [currentSelectedNoteForDelete, setCurrentSelectedNoteForDelete] = useState<Note>()


  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  console.log(tagColors)
  console.log(notes)

  const [updateFormValues, setUpdateFormValues] = useState({
    title: currentSelectedNoteForEdit?.title ?? "",
    content: currentSelectedNoteForEdit?.content ?? "",
    tag: currentSelectedNoteForEdit?.tag ?? "",
  })

  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const handleEditNote = async (noteId: string) => {
    try {

      setIsUpdating(true)

      const formData = new FormData();

      Object.entries(updateFormValues).forEach(([Key, value]) => {
        formData.append(Key, value);
      })

      // eslint-disable-next-line prefer-const
      let result = await updateNote(noteId, formData);

      if (result?.success) {
        toast.success('Note Updated');
        setIsOpen(false);

        window.location.reload();  // Temperorary for force reloading the page to apply changes
      }

      else {
        toast.error("Error Creating Note")
      }

    } catch (error) {
      console.log("Error updating the note");
      throw new Error('Error updating the note');

    } finally {

      setIsUpdating(false)
    }
  }

  const handleNoteDelete = async (noteId: string) => {
    try {

      setIsDeleting(true)

      const result = await deleteNote(noteId);

      if (result?.success) {
        toast.success("Note Deleted")
        window.location.reload()
      }

      else {
        toast.error("Error deleting the note")
      }

    } catch (error) {

    } finally {
      setIsDeleting(false)
    }
  }

  const getNoteTimestampLabel = (note: Note) => {
    const created = new Date(note.createdAt).getTime();
    const updated = new Date(note.updatedAt).getTime();
    const isNew = Math.abs(updated - created) < 2000;

    return isNew
      ? `Created ${formatDistanceToNow(new Date(created))} ago`
      : `Updated ${formatDistanceToNow(new Date(updated))} ago`;
  }

  const handleStarredToggle = async (noteId: string) => {
    try {
      if (!noteId) return;

      // console.log(noteId)

      const result = await toggleStarredNote(noteId);

      if (result?.success) {
        toast.success("Starred");
      }

      else {
        toast.error("Error Starring")
      }

    } catch (error) {

    }
  }

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoadingNotes(true)

      const allNotes = await getAllNotes();

      setNotes(allNotes ?? []);

      setIsLoadingNotes(false)

      if (allNotes?.length === 0) {
        setIsNotesNotPresent(true);
      }

      else {
        setIsNotesNotPresent(false)
      }


    };
    fetchNotes();
  }, []);


  // Handle escape key & body scroll
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Close on outside click
  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    if (currentSelectedNoteForEdit) {
      setUpdateFormValues({
        title: currentSelectedNoteForEdit.title,
        content: currentSelectedNoteForEdit.content ?? "",
        tag: currentSelectedNoteForEdit.tag ?? "",
      });
    }
  }, [currentSelectedNoteForEdit]);

  if (isLoadingNotes) return <NoteCardSkeleton />

  if (isNotesNotPresent) return <CreateNoteButtonForMainPage />

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded modal card */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 grid place-items-center z-[100] px-4"
            layout
          >
            <motion.button
              layout
              className="absolute top-4 right-4 lg:hidden flex items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className={`rounded-2xl w-full max-w-[500px] md:max-h-[90%] max-h-[90vh] flex flex-col  ${active.tag ? tagColors[active.tag as Tag] : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl shadow-sm"}  sm:rounded-3xl overflow-y-auto overflow-x-hidden select-text`}
            >
              <motion.div className="p-4 flex flex-col gap-4">
                <motion.h3
                  layoutId={`title-${active.id}-${id}`}
                  className="font-bold text-3xl text-center text-neutral-700 dark:text-neutral-200"
                >
                  {active.title}
                </motion.h3>

                <motion.p
                  layoutId={`content-${active.id}-${id}`}
                  className="text-secondary text-base whitespace-pre-wrap"
                >
                  {active.content ?? ""}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Notes grid */}
      <ul className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <motion.li
            layoutId={`card-${note.id}-${id}`}
            key={note.id}
            onClick={() => setActive(note)}
            className="flex flex-col cursor-pointer rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <SpotlightCard
              className={`group relative ${note.tag ? tagColors[note.tag as Tag] : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl shadow-sm"}  border-none p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6 justify-between min-h-[160px] md:min-h-[200px] w-full rounded-xl`}
              spotlightColor="rgba(0, 229, 255, 0.3)"
            >
              {/* Card Header */}
              <div className="w-full flex justify-between items-center">
                <Checkbox
                  onClick={(e) => e.stopPropagation()} // prevent card click
                />

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <svg
                      onClick={(e) => e.stopPropagation()} // prevent card click
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="cursor-pointer size-5 hover:bg-accent rounded-lg  transition-colors duration-200"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* <DropdownMenuLabel onClick={(e) => e.stopPropagation()} >My Account</DropdownMenuLabel> */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        setCurrentSelectedNoteForEdit(note);
                        e.stopPropagation();
                        setIsOpen(true)
                      }}
                    >
                      <span>Edit</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="bg-red-500 cursor-pointer"
                      onClick={(e) => {
                        setCurrentSelectedNoteForDelete(note);
                        setIsDeleteDialogOpen(true);
                        e.stopPropagation();
                      }}
                    >
                      {isDeleting ?
                        <>
                          <Loader2Icon className="animate-spin" />
                          Deleting
                        </>
                        :
                        <>
                          Delete
                        </>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-3">
                <motion.h2
                  className="font-bold text-primary text-2xl md:text-3xl dark:text-neutral-200 text-center md:text-left truncate"
                >
                  {note.title}
                </motion.h2>
                <motion.p
                  className="text-secondary text-sm text-center md:text-left line-clamp-3"
                >
                  {note.content ?? ""}
                </motion.p>
              </div>

              {/* Card Tag */}
              {note.tag &&
                <>
                  <div>
                    <Badge variant="default">{note.tag}</Badge>
                  </div>
                </>
              }


              {/* Card Footer */}
              <div className="w-full flex justify-between items-center mt-auto">
                <p className="text-gray-600 text-xs md:text-sm">
                  {getNoteTimestampLabel(note)}
                </p>
                <button
                  className="relative z-10 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    handleStarredToggle(note.id);
                  }}
                >
                  <Star className={`size-4 md:size-4 ${note.starred ? "fill-yellow-400" : ""}`} />
                </button>
              </div>
            </SpotlightCard>


          </motion.li>

        ))}

        {/* Dialog for Update Note */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Update Note</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title: </Label>
                <Input
                  name="title"
                  value={updateFormValues.title}  // Update if necessary
                  id="title"
                  type="email"
                  placeholder="Enter your title..."
                  required
                  onChange={(e) => setUpdateFormValues({ ...updateFormValues, [e.target.name]: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content: </Label>
                <Textarea
                  name="content"
                  value={updateFormValues.content}
                  id="content"
                  placeholder="Enter your content..."
                  className="w-full h-40"
                  onChange={(e) => setUpdateFormValues({ ...updateFormValues, [e.target.name]: e.target.value })}

                />

              </div>

              <div className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                <Badge variant={`${updateFormValues.tag === "WORK" ? "default" : "outline"}`} className={`cursor-pointer hover:bg-muted p-2 px-3 ${updateFormValues.tag === "WORK" ? tagColors[updateFormValues.tag] : ""}`} onClick={() => setUpdateFormValues({ ...updateFormValues, tag: "WORK" })}>WORK</Badge>
                <Badge variant={`${updateFormValues.tag === "PERSONAL" ? "default" : "outline"}`} className={`cursor-pointer hover:bg-muted p-2 px-3 ${updateFormValues.tag === "PERSONAL" ? tagColors[updateFormValues.tag] : ""}`} onClick={() => setUpdateFormValues({ ...updateFormValues, tag: "PERSONAL" })}>PERSONAL</Badge>
                <Badge variant={`${updateFormValues.tag === "STUDY" ? "default" : "outline"}`} className={`cursor-pointer hover:bg-muted p-2 px-3 ${updateFormValues.tag === "STUDY" ? tagColors[updateFormValues.tag] : ""}`} onClick={() => setUpdateFormValues({ ...updateFormValues, tag: "STUDY" })}>STUDY</Badge>
                <Badge variant={`${updateFormValues.tag === "IDEAS" ? "default" : "outline"}`} className={`cursor-pointer hover:bg-muted p-2 px-3 ${updateFormValues.tag === "IDEAS" ? tagColors[updateFormValues.tag] : ""}`} onClick={() => setUpdateFormValues({ ...updateFormValues, tag: "IDEAS" })}>IDEAS</Badge>
                <Badge variant={`${updateFormValues.tag === "OTHER" ? "default" : "outline"}`} className={`cursor-pointer hover:bg-muted p-2 px-3 ${updateFormValues.tag === "OTHER" ? tagColors[updateFormValues.tag] : ""}`} onClick={() => setUpdateFormValues({ ...updateFormValues, tag: "OTHER" })}>OTHER</Badge>
              </div>

            </div>

            <DialogFooter className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
              <DialogClose asChild>
                <Button variant={'outline'}>Cancel</Button>
              </DialogClose>

              <Button
                className="cursor-pointer"
                onClick={() => handleEditNote(currentSelectedNoteForEdit?.id ?? "")}
                disabled={isUpdating || !updateFormValues.title?.trim()}
              >
                {isUpdating ?
                  <>
                    <Loader2Icon className="animate-spin" />
                    Updating
                  </>
                  :
                  <>
                    Update
                  </>}
              </Button>
            </DialogFooter>
          </DialogContent>

        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your Note
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-500 text-primary hover:text-red-500"
                onClick={() => handleNoteDelete(currentSelectedNoteForDelete?.id ?? "")}
              >
                {isDeleting ?
                  <>
                    <Loader2Icon className="animate-spin" />
                    Deleting
                  </>
                  :
                  <>
                    Delete
                  </>
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

export default ExpandableCardDemo
