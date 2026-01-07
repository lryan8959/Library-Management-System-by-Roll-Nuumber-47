"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BookOpen, Users, BookMarked, TrendingUp } from "lucide-react"

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalMembers: 0,
    activeBorrowings: 0,
  })

  useEffect(() => {
    const books = JSON.parse(localStorage.getItem("library_books") || "[]")
    const members = JSON.parse(localStorage.getItem("library_members") || "[]")
    const records = JSON.parse(localStorage.getItem("library_records") || "[]")

    setStats({
      totalBooks: books.length,
      availableBooks: books.filter((b: any) => b.available).length,
      totalMembers: members.length,
      activeBorrowings: records.filter((r: any) => !r.returnDate).length,
    })
  }, [])

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookMarked,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: BookOpen,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      title: "Active Borrowings",
      value: stats.activeBorrowings,
      icon: TrendingUp,
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
