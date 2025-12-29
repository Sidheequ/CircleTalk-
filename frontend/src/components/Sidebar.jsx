import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { Users, Search, Phone, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ className = "" }) => {
    const { getConversations, conversations, selectedUser, setSelectedUser, isConversationsLoading, notifications } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [searchTerm, setSearchTerm] = React.useState("");

    useEffect(() => {
        getConversations();
    }, [getConversations]);

    const filteredConversations = conversations.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isConversationsLoading) return <div className="sidebar-loading">Loading chats...</div>;

    return (
        <aside className={`sidebar glass animate-slide ${className}`}>
            <div className="sidebar-header">
                <div className="sidebar-title">
                    <Users size={20} />
                    <span>Active Chats</span>
                </div>
                <div className="search-container">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="users-list relative">
                {filteredConversations.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                    >
                        <div className="avatar-container">
                            <img
                                src={user.profilePic || '/avatar.png'}
                                alt={user.fullName}
                                className="user-avatar"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="online-indicator" />
                            )}
                        </div>
                        <div className="user-info">
                            <div className="user-name-row flex justify-between items-center">
                                <span className="user-name">{user.fullName}</span>
                                {notifications[user._id] > 0 && (
                                    <span className="notification-badge">{notifications[user._id]}</span>
                                )}
                            </div>
                            <div className={`user-status ${onlineUsers.includes(user._id) ? 'text-green' : ''}`}>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredConversations.length === 0 && (
                    <div className="no-users">
                        <p>{searchTerm ? "No matches found." : "No active chats yet."}</p>
                        <p className="text-xs opacity-60">Click the button below to start one!</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button for New Chat */}
            <Link to="/contacts" className="fab-new-chat glass" title="Start New Chat">
                <div className="fab-icons">
                    <Phone size={20} className="phone-icon" />
                    <Plus size={14} className="plus-icon" />
                </div>
            </Link>
        </aside>
    );
};

export default Sidebar;
