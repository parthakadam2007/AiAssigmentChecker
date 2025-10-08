import Header from '../../shared/components/header/Header';
import PageList from '../../shared/components/sidebar/PageList';
import { useState, useEffect } from 'react';
import UpwardArrow from '../../assets/arrow_upward.svg';
import useManualFetch from '../../shared/hooks/useManualFetch';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

const calculateMessageWidth = (content: string) => {
  const length = content.length;
  if (length < 50) return "max-w-xs";
  if (length < 100) return "max-w-md";
  if (length < 200) return "max-w-lg";
  return "max-w-xl";
};

interface BotApiResponse {
  response?: {
    content?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const AIchatbot = <userType extends 'teacher' | 'student'>({ userType }: { userType: userType }) => {
  const { execute, data, status, error } = useManualFetch<BotApiResponse>();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = { content: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');

    // fire request (but don't handle response here)
    // await execute(`http://localhost:80/python_api/${userType}ChatBottest`, 'POST',
    //   {message: inputMessage} ,
      
    // );

    await execute(`${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/${userType}ChatBottest`, 'POST', {
      message: inputMessage,
    });
  };

  // 🔥 Whenever status/data changes, add bot message
  useEffect(() => {
    if (status === 'success' && data) {
      console.log('API Responsewee:', data);
      const botContent =
        data.response?.content ??
        "error displaying response";

      setMessages((prev) => [...prev, { content: botContent, sender: 'bot' }]);
    }

    if (status === 'error') {
      setMessages((prev) => [
        ...prev,
        { content: `Error: ${error?.message || 'Failed to get response.'}`, sender: 'bot' },
      ]);
    }
  }, [status, data, error]);

  return (
    <div>
      <Header />
      <div className="flex">
        <PageList userType={userType} />

        <div className="relative w-full bg-gray-50 flex flex-col items-center justify-between rounded-[30px]">
          {/* Chat messages - UPDATED CONTAINER */}
          <div className="flex-grow w-full max-w-4xl mx-auto p-4 overflow-y-auto h-[500px] flex flex-col space-y-3 chat-scrollbar"> 

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-4xl ${calculateMessageWidth(msg.content)} ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-gray-800 ml-auto'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {/* Loader */}
            {status === 'loading' && (
              <div className="p-4 my-2 rounded-2xl max-w-xs bg-gray-200 text-gray-800 mr-auto">
                <span className="animate-pulse">Thinking...</span>
              </div>
            )}
          </div>

          {/* Input box */}
          <div className="w-full max-w-4xl mx-auto p-4 mb-[80px]">
            <div className="relative">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text"
                placeholder="Ask Anything"
                className="w-full rounded-full px-5 py-2 pr-24 text-[1.1rem] focus:outline-none focus:ring-2 focus:ring-blue-700 border border-gray-300"
                disabled={status === 'loading'}
              />
              <button
                onClick={handleSend}

                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full px-1 py-1 font-semibold hover:bg-blue-700 transition"

                disabled={status === 'loading'}
              >
                <img src={UpwardArrow} alt="Send" className="inline-block w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIchatbot;