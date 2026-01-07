"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit, Mail, Phone } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
}

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const storedMembers = localStorage.getItem("library_members")
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers))
    } else {
      const sampleMembers: Member[] = [
        { id: "1", name: "John Doe", email: "john@example.com", phone: "555-0101", joinDate: "2024-01-15" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "555-0102", joinDate: "2024-02-20" },
      ]
      setMembers(sampleMembers)
      localStorage.setItem("library_members", JSON.stringify(sampleMembers))
    }
  }, [])

  const saveMembers = (updatedMembers: Member[]) => {
    setMembers(updatedMembers)
    localStorage.setItem("library_members", JSON.stringify(updatedMembers))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMember) {
      const updatedMembers = members.map((member) =>
        member.id === editingMember.id ? { ...member, ...formData } : member,
      )
      saveMembers(updatedMembers)
      setEditingMember(null)
    } else {
      const newMember: Member = {
        id: Date.now().toString(),
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
      }
      saveMembers([...members, newMember])
    }
    setFormData({ name: "", email: "", phone: "" })
    setShowForm(false)
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    saveMembers(members.filter((member) => member.id !== id))
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            {editingMember ? "Edit Member" : "Add New Member"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingMember ? "Update" : "Add"} Member</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingMember(null)
                  setFormData({ name: "", email: "", phone: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="mb-3">
              <h4 className="font-semibold text-foreground text-balance">{member.name}</h4>
              <p className="text-xs text-muted-foreground">Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{member.phone}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(member)} className="flex-1 gap-2">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(member.id)}
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No members found. Add your first member to get started!</p>
        </Card>
      )}
    </div>
  )
}
