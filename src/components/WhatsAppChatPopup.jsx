// src/components/WhatsAppChatPopup.jsx
"use client";

import { useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const WhatsAppChatPopup = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const messageTemplates = [
    {
      id: 1,
      question: "Can I change or cancel my order after it has been placed?",
      message: "Hi, I'd like to know if I can change or cancel my order after it has been placed."
    },
    {
      id: 2,
      question: "Track my order",
      message: "Hi, I'd like to track my order. Can you help me with the status?"
    },
    {
      id: 3,
      question: "What is your return policy?",
      message: "Hi, I'd like to know more about your return policy."
    },
    {
      id: 4,
      question: "How long does it take to process an item?",
      message: "Hi, how long does it take to process an item after ordering?"
    },
    {
      id: 5,
      question: "How long does shipping take?",
      message: "Hi, I'd like to know how long shipping usually takes."
    },
    {
      id: 6,
      question: "Do you ship worldwide?",
      message: "Hi, do you ship worldwide? I'd like to know about international shipping."
    },
  ];

  const phoneNumber = "2347036210107"; // Your WhatsApp number

  const openWhatsAppWithMessage = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsChatOpen(false); // Close popup after opening WhatsApp
  };

  const openCustomMessage = () => {
    const customMessage = "Hi, I have a question about your products.";
    openWhatsAppWithMessage(customMessage);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-14 right-2 z-40 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Chat with us"
      >
        <IoIosChatbubbles size={25} />
      </button>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-2 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-scaleIn">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg font-playfair">Chat with us</h3>
                <p className="text-white/90 text-sm mt-1 font-poppins">
                  Hi, message us with any questions. We're happy to help!
                </p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 border rounded-full"
                aria-label="Close chat"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Message Templates */}
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="space-y-3">
              {/* Instant Answers Section */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 font-poppins uppercase tracking-wide">
                  Instant answers
                </h4>
                <div className="space-y-2">
                  {messageTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => openWhatsAppWithMessage(template.message)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-primary font-poppins">
                        {template.question}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message Input */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 font-poppins">
                  Write message
                </h4>
                <button
                  onClick={openCustomMessage}
                  className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-gray-500 hover:text-primary font-poppins text-sm"
                >
                  Start typing your message...
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center font-poppins">
              We typically reply within minutes
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppChatPopup;