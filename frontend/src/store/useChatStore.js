import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    conversations: [],
    notifications: {}, // {userId: count}
    isUsersLoading: false,
    isMessagesLoading: false,
    isConversationsLoading: false,

    getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
            const res = await axiosInstance.get("/messages/conversations");
            set({ conversations: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch conversations");
        } finally {
            set({ isConversationsLoading: false });
        }
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages, conversations } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });

            // If this is a new conversation person, refresh conversations
            if (!conversations.find(c => c._id === selectedUser._id)) {
                get().getConversations();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        if (selectedUser) {
            get().resetNotification(selectedUser._id);
        }
    },

    resetNotification: (userId) => {
        const { notifications } = get();
        if (notifications[userId]) {
            const newNotifications = { ...notifications };
            delete newNotifications[userId];
            set({ notifications: newNotifications });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, messages, conversations, notifications } = get();

            // Check if sender is in conversations, if not, refresh
            if (!conversations.find(c => c._id === newMessage.senderId)) {
                get().getConversations();
            }

            if (selectedUser && newMessage.senderId === selectedUser._id) {
                set({ messages: [...messages, newMessage] });
            } else {
                // Background notification
                const senderId = newMessage.senderId;
                set({
                    notifications: {
                        ...notifications,
                        [senderId]: (notifications[senderId] || 0) + 1
                    }
                });
                toast.success("New message from another user!");
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },

    blockUser: async (userId) => {
        try {
            const res = await axiosInstance.post(`/messages/block/${userId}`);
            toast.success(res.data.message);
            // Optionally refresh user data if you want to show block status
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to block user");
        }
    },

    clearMessages: async (userId) => {
        try {
            await axiosInstance.delete(`/messages/clear/${userId}`);
            set({ messages: [] });
            toast.success("Chat cleared");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear chat");
        }
    },

    deleteChat: async (userId) => {
        try {
            await axiosInstance.delete(`/messages/delete/${userId}`);
            set({
                messages: [],
                selectedUser: null,
                conversations: get().conversations.filter(c => c._id !== userId)
            });
            toast.success("Conversation deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete conversation");
        }
    },
}));
