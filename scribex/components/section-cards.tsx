'use client'

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import SpotlightCard from "./SpotlightCard"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getRecentlyUpdatedNotesCount, getTotalNotes, getTotalStarredNotes } from "@/server/actions/note.action"
import { Skeleton } from "./ui/skeleton"
import { getTotalUsersCount } from "@/server/actions/user.action"

export function SectionCards() {

    const [totalNotes, setTotalNotes] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalUpdatedNotes, setTotalUpdatedNotes] = useState(0)
    const [totalStarredNotes, setTotalStarredNotes] = useState(0)

    const [isFetchingNotes, setIsFetchingNotes] = useState(false)

  const cardsData = [
    {
      title: "Total Notes",
      value: totalNotes,
      badge: { icon: <IconTrendingUp />, text: "+15%" },
      footer: "Notes created this month",
      subfooter: "Compared to last 30 days",
      trendingIcon: <IconTrendingUp className="size-4" />,
      color: "bg-gradient-to-tr from-teal-500 to-cyan-400 text-white"
    },
    {
      title: "Active Users",
      value: totalUsers,
      badge: { icon: <IconTrendingUp />, text: "+5%" },
      footer: "Currently active in last 7 days",
      subfooter: "Engagement rate increased",
      trendingIcon: <IconTrendingUp className="size-4" />,
      color: "bg-gradient-to-tr from-indigo-500 to-purple-400 text-white"
    },
    {
      title: "Notes Updated",
      value: totalUpdatedNotes,
      badge: { icon: <IconTrendingUp />, text: "+8%" },
      footer: "Recently edited notes",
      subfooter: "Compared to previous week",
      trendingIcon: <IconTrendingUp className="size-4" />,
      color: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white"
    },
    {
      title: "Starred Notes",
      value: totalStarredNotes,
      badge: { icon: <IconTrendingUp />, text: "+3%" },
      footer: "Favorite notes by user",
      subfooter: "Based on activity this week",
      trendingIcon: <IconTrendingUp className="size-4" />,
      color: "bg-gradient-to-tr from-rose-500 to-pink-500 text-white"
    },
  ]

  useEffect(() => {
    try {
        const fetchDashboardInfo = async () => {

            setIsFetchingNotes(true)

            const totalNotesData = await getTotalNotes();
            const totalUsersData = await getTotalUsersCount();
            const totalUpdatedNotesData = await getRecentlyUpdatedNotesCount()
            const totalStarredNotesData = await getTotalStarredNotes();

            // console.log("Total Starred Notes",totalStarredNotesData)

            if (totalNotesData || totalUsersData || totalUpdatedNotes) {
                setTotalNotes(totalNotesData ?? 0);
                setTotalUsers(totalUsersData ?? 0)
                setTotalUpdatedNotes(totalUpdatedNotesData ?? 0)
                setTotalStarredNotes(totalStarredNotesData ?? 0)

                console.log(totalUpdatedNotes)

                setIsFetchingNotes(false)
            }

            
        }

        fetchDashboardInfo()
    } catch (error) {
        console.log("Error Fetching Dashboard Info")
        throw new Error("Error Fetching Dashboard Info")
    }
  }, [])

  return (
    <div className="grid grid-cols-1 max-[830px]:grid-cols-1 min-[830px]:grid-cols-2 2xl:grid-cols-4   mt-2 gap-4 @5xl/main:grid-cols-4">
      {cardsData.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
        >
          <SpotlightCard
            className={`flex flex-col justify-between ${card.color} p-6 border-none rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300`}
            spotlightColor="rgba(0, 229, 255, 0.5)"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-primary">{card.title}</p>
                <h3 className="text-2xl md:text-3xl font-semibold tabular-nums">
                    {isFetchingNotes ? 
                        <>
                            <Skeleton className="h-8 w-[50px]"/>
                        </>
                        :
                        <>
                            {card.value}
                        </>
                    }
                </h3>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                {card.badge.icon}
                {card.badge.text}
              </Badge>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex text-secondary items-center gap-2 font-medium line-clamp-1">
                {card.footer} {card.trendingIcon}
              </div>
              <p className="text-primary text-xs">{card.subfooter}</p>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  )
}
