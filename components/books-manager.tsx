"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  available: boolean
}

export default function BooksManager() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
  })

  // Load books from localStorage
  useEffect(() => {
    const storedBooks = localStorage.getItem("library_books")
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    } else {
      // Add sample data
      const sampleBooks: Book[] = [
        {
          id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          isbn: "9780743273565",
          category: "Fiction",
          available: true,
        },
        {
          id: "2",
          title: "1984",
          author: "George Orwell",
          isbn: "9780451524935",
          category: "Fiction",
          available: true,
        },
        {
          id: "3",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          isbn: "9780061120084",
          category: "Fiction",
          available: false,
        },
      ]
      setBooks(sampleBooks)
      localStorage.setItem("library_books", JSON.stringify(sampleBooks))
    }
  }, [])

  const saveBooks = (updatedBooks: Book[]) => {
    setBooks(updatedBooks)
    localStorage.setItem("library_books", JSON.stringify(updatedBooks))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBook) {
      const updatedBooks = books.map((book) => (book.id === editingBook.id ? { ...book, ...formData } : book))
      saveBooks(updatedBooks)
      setEditingBook(null)
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        ...formData,
        available: true,
      }
      saveBooks([...books, newBook])
    }
    setFormData({ title: "", author: "", isbn: "", category: "" })
    setShowForm(false)
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    saveBooks(books.filter((book) => book.id !== id))
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">{editingBook ? "Edit Book" : "Add New Book"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Author</label>
                <Input
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">ISBN</label>
                <Input
                  required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="Enter ISBN"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Fiction, Science, History"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingBook ? "Update" : "Add"} Book</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingBook(null)
                  setFormData({ title: "", author: "", isbn: "", category: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Books List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-balance">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  book.available ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {book.available ? "Available" : "Borrowed"}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Category:</span> {book.category}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(book)} className="flex-1 gap-2">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(book.id)}
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No books found. Add your first book to get started!</p>
        </Card>
      )}
    </div>
  )
}
