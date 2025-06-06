"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical } from "lucide-react"
import Image from "next/image"

const chatSessions = [
  {
    id: 1,
    ownerName: "John Doe",
    petName: "Whiskers",
    ownerImage: "/placeholder.svg?height=50&width=50",
    lastMessage: "Thank you for the advice, Whiskers is feeling better!",
    timestamp: "5 min ago",
    unread: 2,
    isActive: true,
  },
  {
    id: 2,
    ownerName: "Sarah Smith",
    petName: "Buddy",
    ownerImage: "/placeholder.svg?height=50&width=50",
    lastMessage: "Can we schedule a follow-up appointment?",
    timestamp: "1 hour ago",
    unread: 1,
    isActive: true,
  },
  {
    id: 3,
    ownerName: "Mike Johnson",
    petName: "Luna",
    ownerImage: "/placeholder.svg?height=50&width=50",
    lastMessage: "The medication is working well",
    timestamp: "2 hours ago",
    unread: 0,
    isActive: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "owner",
    message: "Hi Dr. Johnson, Whiskers has been eating less than usual for the past 2 days.",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "vet",
    message: "Hello John! I'm sorry to hear that. Has there been any change in his behavior or activity level?",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    sender: "owner",
    message: "He seems a bit more lethargic and is sleeping more than usual.",
    timestamp: "10:05 AM",
  },
  {
    id: 4,
    sender: "vet",
    message:
      "Based on what you're describing, it could be a few things. Let's schedule a video call to examine him properly. In the meantime, make sure he has access to fresh water.",
    timestamp: "10:07 AM",
  },
  {
    id: 5,
    sender: "owner",
    message: "Thank you for the advice, Whiskers is feeling better!",
    timestamp: "2:30 PM",
  },
]

export default function VetChat() {
  const [selectedChat, setSelectedChat] = useState(chatSessions[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send the message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat with Pet Owners</h1>
        <p className="text-gray-600 mt-2">Communicate with pet owners about their pets' health</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Active Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                    selectedChat.id === chat.id ? "bg-violet-50 border-l-4 border-l-violet-600" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Image
                      src={chat.ownerImage || "/placeholder.svg"}
                      alt={chat.ownerName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{chat.ownerName}</p>
                        <div className="flex items-center space-x-1">
                          {chat.unread > 0 && (
                            <Badge className="bg-violet-600 text-white text-xs px-2 py-1">{chat.unread}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Pet: {chat.petName}</p>
                      <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={selectedChat.ownerImage || "/placeholder.svg"}
                  alt={selectedChat.ownerName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <CardTitle className="text-lg">{selectedChat.ownerName}</CardTitle>
                  <CardDescription>Pet: {selectedChat.petName}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "vet" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "vet" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.sender === "vet" ? "text-violet-200" : "text-gray-500"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="btn-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
