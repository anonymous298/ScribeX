"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getNotesPerMonth } from "@/server/actions/note.action";

type ChartItem = {
  month: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "Notes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarForNoteActivity() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getNotesPerMonth();
      if (data) setChartData(data);
    };
    fetchChartData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes Activity</CardTitle>
        <CardDescription>Notes created per month</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(v) => v.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Trending up by 5.2% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Showing total notes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
