"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Calendar } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  available: boolean
}

interface Member {
  id: string
  name: string
}

interface BorrowRecord {
  id: string
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  borrowDate: string
  dueDate: string
  returnDate?: string
}

export default function BorrowingManager() {
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [records, setRecords] = useState<BorrowRecord[]>([])
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedMember, setSelectedMember] = useState("")

  useEffect(() => {
    const storedBooks = localStorage.getItem("library_books")
    const storedMembers = localStorage.getItem("library_members")
    const storedRecords = localStorage.getItem("library_records")

    if (storedBooks) setBooks(JSON.parse(storedBooks))
    if (storedMembers) setMembers(JSON.parse(storedMembers))
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords))
    } else {
      const sampleRecords: BorrowRecord[] = []
      setRecords(sampleRecords)
      localStorage.setItem("library_records", JSON.stringify(sampleRecords))
    }
  }, [])

  const handleBorrow = () => {
    if (!selectedBook || !selectedMember) return

    const book = books.find((b) => b.id === selectedBook)
    const member = members.find((m) => m.id === selectedMember)
    if (!book || !member) return

    const borrowDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 14 days loan period

    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      borrowDate: borrowDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
    }

    const updatedRecords = [...records, newRecord]
    setRecords(updatedRecords)
    localStorage.setItem("library_records", JSON.stringify(updatedRecords))

    // Update book availability
    const updatedBooks = books.map((b) => (b.id === book.id ? { ...b, available: false } : b))
    setBooks(updatedBooks)
    localStorage.setItem("library_books", JSON.stringify(updatedBooks))

    setSelectedBook("")
    setSelectedMember("")
  }

  const handleReturn = (recordId: string) => {
    const record = records.find((r) => r.id === recordId)
    if (!record) return

    const updatedRecords = records.map((r) =>
      r.id === recordId ? { ...r, returnDate: new Date().toISOString().split("T")[0] } : r,
    )
    setRecords(updatedRecords)
    localStorage.setItem("library_records", JSON.stringify(updatedRecords))

    // Update book availability
    const updatedBooks = books.map((b) => (b.id === record.bookId ? { ...b, available: true } : b))
    setBooks(updatedBooks)
    localStorage.setItem("library_books", JSON.stringify(updatedBooks))
  }

  const availableBooks = books.filter((b) => b.available)
  const activeRecords = records.filter((r) => !r.returnDate)
  const returnedRecords = records.filter((r) => r.returnDate)

  return (
    <div className="space-y-6">
      {/* Borrow Form */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Borrow a Book</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Select Book</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Choose a book...</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.author}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Select Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleBorrow} disabled={!selectedBook || !selectedMember} className="w-full">
              Borrow Book
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Borrowings */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Active Borrowings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {activeRecords.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="mb-3">
                <h4 className="font-semibold text-foreground text-balance">{record.bookTitle}</h4>
                <p className="text-sm text-muted-foreground">{record.memberName}</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className={new Date(record.dueDate) < new Date() ? "text-destructive" : ""}>
                    Due: {new Date(record.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button size="sm" onClick={() => handleReturn(record.id)} className="mt-4 w-full gap-2">
                <CheckCircle className="h-3 w-3" />
                Mark as Returned
              </Button>
            </Card>
          ))}
        </div>
        {activeRecords.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No active borrowings at the moment.</p>
          </Card>
        )}
      </div>

      {/* Return History */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Return History</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {returnedRecords.slice(0, 6).map((record) => (
            <Card key={record.id} className="p-4 opacity-75">
              <div className="mb-3">
                <h4 className="font-semibold text-foreground text-balance">{record.bookTitle}</h4>
                <p className="text-sm text-muted-foreground">{record.memberName}</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-accent-foreground">
                  <CheckCircle className="h-3 w-3" />
                  <span>Returned: {record.returnDate && new Date(record.returnDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {returnedRecords.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No return history yet.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
