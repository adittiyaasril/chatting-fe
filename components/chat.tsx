"use client"
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Avatar, Input, Button } from '@nextui-org/react';

interface Participant {
  id: string;
  name: string;
  role: number;
}

interface Comment {
  id: number;
  type: 'text';
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
    return <div>Loading...</div>;
  }

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
            className={`flex flex-col max-w-[100%] ${comment.sender === 'customer@mail.com' ? 'items-end' : 'items-start'}`}
          >
            <Card
              className={`${comment.sender === 'customer@mail.com' ? 'self-end bg-blue-200' : 'self-start bg-gray-100'
                }`}
            >
              <CardBody>
                {comment.sender !== 'customer@mail.com' && (
                  <p className="font-semibold text-left">{getSenderName(comment.sender)}</p>
                )}
                <p>{comment.message}</p>
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

