"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Lock, CreditCard, Video } from "lucide-react"
import Image from "next/image"

const chatSessions = [
  {
    id: 1,
    vetName: "Dr. Sarah Johnson",
    vetImage: "/placeholder.svg?height=50&width=50",
    lastMessage: "How is Whiskers feeling today?",
    timestamp: "2 hours ago",
    isPaid: true,
    isActive: true,
  },
  {
    id: 2,
    vetName: "Dr. Michael Chen",
    vetImage: "/placeholder.svg?height=50&width=50",
    lastMessage: "Thank you for the consultation",
    timestamp: "1 day ago",
    isPaid: false,
    isActive: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "vet",
    message: "Hello! How can I help you with Whiskers today?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "owner",
    message: "Hi Dr. Johnson, Whiskers has been eating less than usual for the past 2 days.",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    sender: "vet",
    message: "I see. Has there been any change in his behavior or activity level?",
    timestamp: "10:03 AM",
  },
  {
    id: 4,
    sender: "owner",
    message: "He seems a bit more lethargic and is sleeping more than usual.",
    timestamp: "10:05 AM",
  },
]

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(chatSessions[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat.isPaid) {
      // In real app, this would send the message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat with Veterinarians</h1>
        <p className="text-gray-600 mt-2">Communicate with your veterinarians</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
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
                      src={chat.vetImage || "/placeholder.svg"}
                      alt={chat.vetName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{chat.vetName}</p>
                        <div className="flex items-center space-x-1">
                          {chat.isPaid ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                          ) : (
                            <Lock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>
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
                  src={selectedChat.vetImage || "/placeholder.svg"}
                  alt={selectedChat.vetName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <CardTitle className="text-lg">{selectedChat.vetName}</CardTitle>
                  <CardDescription>{selectedChat.isPaid ? "Active session" : "Payment required"}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              </div>
            </div>
          </CardHeader>

          {selectedChat.isPaid ? (
            <>
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "owner" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "owner" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${message.sender === "owner" ? "text-violet-200" : "text-gray-500"}`}
                        >
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
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Required</h3>
                <p className="text-gray-600 mb-4">
                  You need to pay for a consultation to start chatting with {selectedChat.vetName}
                </p>
                <Button className="btn-primary">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay $45 to Activate Chat
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
