"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Send, Search, Phone, Mail } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Amina Kedir",
    role: "Seller",
    avatar: "/images/girl1.png",
    lastMessage: "Thank you for your interest! The dress is available in all sizes.",
    timestamp: "2 hours ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Hana Badege",
    role: "Seller",
    avatar: "/images/girl2.png",
    lastMessage: "Your order has been shipped!",
    timestamp: "1 day ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Lily Tadesse",
    role: "Seller",
    avatar: "/images/girl3.jpg",
    lastMessage: "Can you provide more details about the gabi?",
    timestamp: "3 days ago",
    unread: 0,
  },
]

const messages = [
  {
    id: 1,
    sender: "Amina Kedir",
    role: "Seller",
    text: "Hi! Thank you for your interest in our traditional dress collection.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Hi Amina! I'm interested in the Amina Kedir dress. Is it available in size M?",
    timestamp: "10:35 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Amina Kedir",
    role: "Seller",
    text: "Thank you for your interest! The dress is available in all sizes. Would you like to place an order?",
    timestamp: "10:40 AM",
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Link href="/buyer-dashboard">
              <Button variant="outline" className="bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 border-b text-left transition ${
                      selectedConversation.id === conv.id ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={conv.avatar || "/placeholder.svg"}
                          alt={conv.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{conv.name}</h3>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-xs text-primary font-medium mb-1">{conv.role}</p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-xs text-primary">{selectedConversation.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isOwn ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {!msg.isOwn && <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>}
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-white/70" : "text-gray-500"}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
