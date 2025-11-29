"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getCreatedVsUpdatedNotesPerMonth } from "@/server/actions/note.action"

export const description = "Created vs Updated Notes per Month (Stacked Bar Chart)"

type ChartDataProp = {
  month: string
  created: number
  updated: number
}

const chartConfig = {
  created: { label: "Created Notes", color: "var(--chart-1)" },
  updated: { label: "Updated Notes", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartBarForComparision() {
  const [chartData, setChartData] = useState<ChartDataProp[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCreatedVsUpdatedNotesPerMonth()
        if (data) setChartData(data)
      } catch (error) {
        console.error("Failed to fetch notes comparison data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes Overview</CardTitle>
        <CardDescription>Created vs Updated Notes (Last 6 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="created"
              stackId="a"
              fill="var(--color-created)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="updated"
              stackId="a"
              fill="var(--color-updated)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Notes activity trend <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing created vs updated notes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
