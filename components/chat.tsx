"use client"
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetch('/chat-data.json')
      .then((response) => response.json())
      .then((data) => setChatData(data.results));
  }, []);

  const getSenderName = (senderId: string): string => {
    const participant = chatData?.room.participant.find((p) => p.id === senderId);
    return participant ? participant.name : 'Unknown';
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Simulasi menambahkan pesan baru ke chat
      const newComment: Comment = {
        id: Date.now(),
        type: 'text',
        message: newMessage,
        sender: 'customer@mail.com', // Misal, gunakan sender dari user login
      };
      setChatData(prevState => ({
        ...prevState!,
        comments: [...prevState!.comments, newComment]
      }));
      setNewMessage('');
    }
  };

  if (!chatData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col max-w-xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar
          src={chatData.room.image_url}
          alt="Room"
          size="lg"
          className="rounded-full"
        />
        <h1 className="text-xl font-bold">{chatData.room.name}</h1>
      </div>

      {chatData.comments.map((comment) => (
        <div
          key={comment.id}
          className={`flex flex-col mb-4 max-w-[75%] ${comment.sender === 'customer@mail.com' ? 'self-end items-end' : 'self-start items-start'}`}
        >
          <Card
            className={`${comment.sender === 'customer@mail.com' ? 'bg-blue-200' : 'bg-gray-100'}`}
          >
            <CardBody>
              <p className="font-semibold">{getSenderName(comment.sender)}</p>
              <p>{comment.message}</p>
            </CardBody>
          </Card>
        </div>
      ))}

      {/* Input untuk mengirim pesan */}
      <div className="flex items-center space-x-2 mt-4">
        <Input
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button auto onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
