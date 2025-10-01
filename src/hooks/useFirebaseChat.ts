import { useState, useEffect, useCallback } from 'react';
import { ref, query, orderByChild, limitToLast, onValue, push, remove, DatabaseReference } from 'firebase/database';
import { db } from '../firebase';
import { Message } from '../types';

const MESSAGES_PER_PAGE = 50;

export function useFirebaseChat(isOpen: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const chatRef = ref(db, 'chat');
      const messagesQuery = query(
        chatRef,
        orderByChild('timestamp'),
        limitToLast(MESSAGES_PER_PAGE)
      );

      const unsubscribe = onValue(messagesQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.entries(data)
            .map(([id, value]: [string, any]) => ({
              id,
              ...value
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

          setMessages(messageList);
          setLastMessageTimestamp(messageList[messageList.length - 1]?.timestamp || null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const chatRef = ref(db, 'chat');
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newMessages = Object.values(data).filter((msg: any) => 
            msg.timestamp > Date.now() - 300000
          ).length;
          setUnreadCount(newMessages);
        }
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string, username: string, isAdmin: boolean) => {
    try {
      const chatRef = ref(db, 'chat');
      await push(chatRef, {
        text,
        timestamp: Date.now(),
        username,
        isAdmin
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const messageRef = ref(db, `chat/${messageId}`);
      await remove(messageRef);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (!lastMessageTimestamp) return;

    const chatRef = ref(db, 'chat');
    const oldMessagesQuery = query(
      chatRef,
      orderByChild('timestamp'),
      limitToLast(MESSAGES_PER_PAGE)
    );

    try {
      const snapshot = await new Promise<any>((resolve, reject) => {
        onValue(oldMessagesQuery, resolve, reject);
      });

      const data = snapshot.val();
      if (data) {
        const oldMessages = Object.entries(data)
          .map(([id, value]: [string, any]) => ({
            id,
            ...value
          }))
          .filter((msg) => msg.timestamp < lastMessageTimestamp)
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages((prev) => [...oldMessages, ...prev]);
        if (oldMessages.length > 0) {
          setLastMessageTimestamp(oldMessages[0].timestamp);
        }
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  }, [lastMessageTimestamp]);

  return {
    messages,
    loading,
    unreadCount,
    sendMessage,
    deleteMessage,
    loadMoreMessages
  };
}