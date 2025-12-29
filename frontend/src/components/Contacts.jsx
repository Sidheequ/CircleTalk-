import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, User as UserIcon } from 'lucide-react';

const Contacts = () => {
    const { getUsers, users, isUsersLoading, setSelectedUser } = useChatStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        navigate('/');
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isUsersLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">Loading contacts...</div>;
    }

    return (
        <div className="profile-page animate-fade">
            <div className="profile-container glass">
                <Link to="/" className="back-btn">
                    <ChevronLeft size={20} />
                    <span>Back to Chats</span>
                </Link>

                <div className="profile-header">
                    <h2 className="profile-title">All Contacts</h2>
                    <p className="profile-subtitle">Find people to chat with</p>
                </div>

                <div className="search-wrapper mb-6">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search people..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="contacts-list overflow-y-auto max-h-[500px] pr-2">
                    {filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => handleSelectUser(user)}
                            className="user-item w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-color)] rounded-xl transition-all"
                        >
                            <div className="avatar-wrapper relative">
                                <img
                                    src={user.profilePic || '/avatar.png'}
                                    alt={user.fullName}
                                    className="user-avatar w-12 h-12 rounded-full object-cover border-2 border-[var(--border-color)]"
                                />
                            </div>
                            <div className="text-left flex-1">
                                <h4 className="font-semibold">{user.fullName}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                            </div>
                        </button>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-[var(--text-secondary)]">
                            {searchTerm ? "No matches found." : "No other users found."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contacts;
