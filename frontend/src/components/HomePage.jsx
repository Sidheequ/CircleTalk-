import React from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useChatStore } from '../store/useChatStore';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="home-page">
      <div className="dashboard-container">
        <Sidebar className={selectedUser ? 'mobile-hidden' : ''} />
        <ChatWindow className={!selectedUser ? 'mobile-hidden' : ''} />
      </div>
    </div>
  );
};

export default HomePage;