import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Image, X, MoreVertical, Phone, Video, ChevronLeft } from 'lucide-react';

const ChatWindow = ({ className = "" }) => {
    const { messages, getMessages, isMessagesLoading, selectedUser, setSelectedUser, sendMessage, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);
    const [text, setText] = React.useState('');
    const [imagePreview, setImagePreview] = React.useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        }

        return () => unsubscribeFromMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!selectedUser) {
        return (
            <div className={`chat-placeholder glass animate-fade ${className}`}>
                <div className="placeholder-content">
                    <div className="welcome-icon">💬</div>
                    <h2>Welcome to CircleTalk</h2>
                    <p>Select a contact to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`chat-window glass animate-fade ${className}`}>
            {/* Chat Header */}
            <div className="chat-header">
                <button className="back-mobile-btn" onClick={() => setSelectedUser(null)}>
                    <ChevronLeft size={24} />
                </button>
                <div className="header-info">
                    <img src={selectedUser.profilePic || '/avatar.png'} alt="" className="header-avatar" />
                    <div>
                        <h3 className="header-name">{selectedUser.fullName}</h3>
                        <p className={`header-status ${useAuthStore.getState().onlineUsers.includes(selectedUser._id) ? 'text-green' : ''}`}>
                            {useAuthStore.getState().onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="header-btn"><Video size={20} /></button>
                    <button className="header-btn"><Phone size={20} /></button>
                    <button className="header-btn"><MoreVertical size={20} /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`message-wrapper ${message.senderId === authUser?._id ? 'own' : 'other'}`}
                    >
                        <div className={`message-bubble ${message.senderId === authUser?._id ? 'bubble-out' : 'bubble-in'}`}>
                            {message.image && <img src={message.image} alt="attachment" className="message-image" />}
                            <p className="message-text">{message.text}</p>
                            <span className="message-time">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="chat-input-area">
                {imagePreview && (
                    <div className="image-preview-container">
                        <div className="preview-wrapper">
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                            <button className="remove-image-btn" onClick={() => setImagePreview(null)}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
                <div className="input-wrapper">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => setImagePreview(reader.result);
                            reader.readAsDataURL(file);
                        }}
                    />
                    <button className="input-action-btn" onClick={() => fileInputRef.current?.click()}><Image size={22} /></button>
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="chat-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (text.trim() || imagePreview)) {
                                sendMessage({ text: text.trim(), image: imagePreview });
                                setText('');
                                setImagePreview(null);
                            }
                        }}
                    />
                    <button
                        className="send-btn"
                        disabled={!text.trim() && !imagePreview}
                        onClick={() => {
                            if (text.trim() || imagePreview) {
                                sendMessage({ text: text.trim(), image: imagePreview });
                                setText('');
                                setImagePreview(null);
                            }
                        }}
                    >
                        <Send size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
