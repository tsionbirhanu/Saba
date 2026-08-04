"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Send, Search, Phone, Mail } from "lucide-react";
import {
  ApiConversation,
  ApiMessage,
  ApiUser,
  getConversations,
  getLoggedInUser,
  getMessages,
  getUser,
  sendMessage,
} from "@/lib/api-client";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatConversationTime(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedUserId = searchParams.get("user");
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [directUser, setDirectUser] = useState<ApiUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(requestedUserId);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  async function loadConversations() {
    const rows = await getConversations();
    setConversations(rows);
    if (!selectedUserId && rows[0]) {
      setSelectedUserId(rows[0].user.id);
    }
  }

  async function loadThread(userId: string) {
    const rows = await getMessages(userId);
    setMessages(rows);
  }

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const user = await getLoggedInUser();
        setCurrentUser(user);
        await loadConversations();
        if (requestedUserId) {
          const userToMessage = await getUser(requestedUserId).catch(() => null);
          setDirectUser(userToMessage);
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    loadThread(selectedUserId).catch(() => setStatus("Could not load messages."));
    const interval = window.setInterval(() => {
      loadThread(selectedUserId).catch(() => undefined);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [selectedUserId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.user.id === selectedUserId) || null,
    [conversations, selectedUserId]
  );
  const selectedUser = selectedConversation?.user || directUser;

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSend() {
    if (!selectedUserId || !messageText.trim()) return;
    setStatus("");
    try {
      await sendMessage(selectedUserId, messageText.trim());
      setMessageText("");
      await Promise.all([loadThread(selectedUserId), loadConversations()]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not send message.");
    }
  }

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
            <Link href="/buyer-dashboard">
              <Button variant="outline" className="bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {status && <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">{status}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[640px] lg:h-[600px]">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col min-h-80 lg:min-h-0">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">No conversations yet.</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.user.id}
                      onClick={() => setSelectedUserId(conversation.user.id)}
                      className={`w-full p-4 border-b text-left transition ${
                        selectedUserId === conversation.user.id ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Image
                          src={conversation.user.profileImage || "/placeholder.svg"}
                          alt={conversation.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900">{conversation.user.name}</h3>
                            <span className="text-xs text-gray-500">
                              {formatConversationTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-primary font-medium mb-1">{conversation.user.role}</p>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.text}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[520px] lg:min-h-0">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={selectedUser.profileImage || "/placeholder.svg"}
                        alt={selectedUser.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h2 className="font-medium text-gray-900">{selectedUser.name}</h2>
                        <p className="text-xs text-primary">{selectedUser.role}</p>
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

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-600">No messages yet.</div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.senderId === currentUser.id;
                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[85%] sm:max-w-xs break-words px-4 py-2 rounded-lg ${
                                isOwn ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {!isOwn && (
                                <p className="text-xs font-medium mb-1 opacity-75">{selectedUser.name}</p>
                              )}
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-gray-500"}`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(event) => setMessageText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleSend();
                        }}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-white">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600">
                  Select a conversation to start messaging.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
