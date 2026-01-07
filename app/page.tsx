"use client"

import { useState } from "react"
import { BookOpen, Users, BookMarked } from "lucide-react"
import BooksManager from "@/components/books-manager"
import MembersManager from "@/components/members-manager"
import BorrowingManager from "@/components/borrowing-manager"
import StatsOverview from "@/components/stats-overview"

export default function LibraryManagementSystem() {
  const [activeTab, setActiveTab] = useState<"books" | "members" | "borrow">("books")

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary via-accent to-primary py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-2xl font-bold text-primary-foreground mx-8">
            ⭐ MADE BY ROLL NUMBER 47 - RAHMEEN FATIMA ⭐
          </span>
          <span className="text-2xl font-bold text-primary-foreground mx-8">
            ⭐ MADE BY ROLL NUMBER 47 - RAHMEEN FATIMA ⭐
          </span>
          <span className="text-2xl font-bold text-primary-foreground mx-8">
            ⭐ MADE BY ROLL NUMBER 47 - RAHMEEN FATIMA ⭐
          </span>
          <span className="text-2xl font-bold text-primary-foreground mx-8">
            ⭐ MADE BY ROLL NUMBER 47 - RAHMEEN FATIMA ⭐
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Library Management</h1>
                <p className="text-sm text-muted-foreground">Manage your library with ease</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-6">
        <StatsOverview />
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("books")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === "books"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookMarked className="h-4 w-4" />
            Books
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === "members"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Members
          </button>
          <button
            onClick={() => setActiveTab("borrow")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === "borrow"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Borrowing
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "books" && <BooksManager />}
        {activeTab === "members" && <MembersManager />}
        {activeTab === "borrow" && <BorrowingManager />}
      </main>

      {/* Footer with ownership credits */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Made by <span className="font-semibold text-foreground">Roll Number 47 - Rahmeen Fatima</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
