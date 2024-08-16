"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Avatar, Input, Button, Skeleton } from '@nextui-org/react';

interface Participant {
  id: string;
  name: string;
  role: number;
}

interface Comment {
  id: number;
  type: 'text' | 'image' | 'video' | 'pdf';
  message: string;
  sender: string;
}

interface ChatData {
  room: {
    name: string;
    id: number;
    image_url: string;
    participant: Participant[];
  };
  comments: Comment[];
}

const ChatPage = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/chat-data.json')
      .then((response) => response.json())
      .then((data) => setChatData(data.results));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData?.comments]);

  const getSenderName = (senderId: string): string => {
    const participant = chatData?.room.participant.find((p) => p.id === senderId);
    return participant ? participant.name : 'Unknown';
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        type: 'text',
        message: newMessage,
        sender: 'customer@mail.com',
      };
      setChatData((prevState) => ({
        ...prevState!,
        comments: [...prevState!.comments, newComment],
      }));
      setNewMessage('');
    }
  };

  if (!chatData) {
    return (
      <div className="flex flex-col h-screen max-w-xl mx-auto p-4 space-y-4">
        {/* Skeleton Loading */}
        <div className="flex items-center space-x-4 mb-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32 rounded" />
        </div>
        <div className="flex-1 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className="h-20 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderMessageContent = (comment: Comment) => {
    switch (comment.type) {
      case 'text':
        return <p>{comment.message}</p>;
      case 'image':
        return <img src={comment.message} alt="Image" className="max-w-full h-auto" />;
      case 'video':
        return (
          <video controls className="max-w-full h-auto">
            <source src={comment.message} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
        return (
          <a href={comment.message} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            View PDF Document
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
      {/* Header Chat */}
      <div className="flex items-center space-x-4 mb-2">
        <Avatar
          src={chatData.room.image_url}
          alt="Room"
          size="md"
          className="rounded-full"
        />
        <h1 className="text-xl font-bold">{chatData.room.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 hide-scrollbar">
        {chatData.comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex ${comment.sender === 'customer@mail.com' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`message-card ${comment.sender === 'customer@mail.com' ? 'bg-blue-200' : 'bg-gray-100'}`}>
              <CardBody>
                <p className="font-semibold">{getSenderName(comment.sender)}</p>
                {renderMessageContent(comment)}
              </CardBody>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2">
        <Input
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
