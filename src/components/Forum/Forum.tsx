import React, { useState, useEffect } from 'react';
import ForumList from './ForumList';
import TopicView from './TopicView';
import NewTopicModal from './NewTopicModal';
import { Topic, Message } from '../../types/forum';
import { getTopics, getTopicMessages, createTopic, createMessage } from '../../services/forumService';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

interface ForumProps {
  darkMode: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
}

const Forum: React.FC<ForumProps> = ({ darkMode, setIsAuthModalOpen }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const fetchedTopics = await getTopics();
    setTopics(fetchedTopics);
    setLoading(false);
  };

  const handleTopicClick = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      const fetchedMessages = await getTopicMessages(topicId);
      setMessages(fetchedMessages);
    }
  };

  const handleNewTopic = () => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setShowNewTopicModal(true);
  };

  const handleCreateTopic = async (title: string, description: string) => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const topicId = await createTopic(
      title,
      description,
      auth.currentUser.uid,
      auth.currentUser.displayName || 'Usuario Anónimo'
    );

    if (topicId) {
      toast.success('Tema creado exitosamente');
      setShowNewTopicModal(false);
      loadTopics();
    } else {
      toast.error('Error al crear el tema');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!auth.currentUser || !selectedTopic) {
      setIsAuthModalOpen(true);
      return;
    }

    const messageId = await createMessage(
      selectedTopic.id,
      content,
      auth.currentUser.uid,
      auth.currentUser.displayName || 'Usuario Anónimo'
    );

    if (messageId) {
      const updatedMessages = await getTopicMessages(selectedTopic.id);
      setMessages(updatedMessages);
    } else {
      toast.error('Error al enviar el mensaje');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <MessageSquare className="w-12 h-12 mb-4 animate-pulse" />
        <p className="text-lg font-medium">Cargando foros...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedTopic ? (
        <TopicView
          topic={selectedTopic}
          messages={messages}
          onBack={() => setSelectedTopic(null)}
          onSendMessage={handleSendMessage}
          darkMode={darkMode}
        />
      ) : (
        <ForumList
          topics={topics}
          onTopicClick={handleTopicClick}
          onNewTopic={handleNewTopic}
          darkMode={darkMode}
        />
      )}

      <NewTopicModal
        isOpen={showNewTopicModal}
        onClose={() => setShowNewTopicModal(false)}
        onSubmit={handleCreateTopic}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Forum;