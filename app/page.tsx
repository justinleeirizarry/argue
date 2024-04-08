"use client";
// 1. Import Dependencies
import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { useActions, readStreamableValue } from "ai/rsc";
import { type AI } from "./action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";

import MessagesComponent from "@/components/message-list";
import Webcam from "@/components/webcam";

interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}
interface Message {
  id: number;
  type: string;
  content: string;
  userMessage: string;
  images: Image[];
  videos: Video[];
  followUp: FollowUp | null;
  isStreaming: boolean;
  searchResults?: SearchResult[];
}
interface StreamMessage {
  searchResults?: any;
  userMessage?: string;
  llmResponse?: string;
  llmResponseEnd?: boolean;
  images?: any;
  videos?: any;
  followUp?: any;
}
interface Image {
  link: string;
}
interface Video {
  link: string;
  imageUrl: string;
}
interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}
export default function Page() {
  // 3. Set up action that will be used to stream all the messages
  const { myAction, Decider } = useActions<typeof AI>();
  // 4. Set up form submission handling
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const oppositionRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [opposition, setOpposition] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  // 5. Set up state for the messages
  const [messages, setMessages] = useState<Message[]>([]);
  // 6. Set up state for the CURRENT LLM response (for displaying in the UI while streaming)
  const [currentLlmResponse, setCurrentLlmResponse] = useState("");
  // 7. Set up handler for when the user clicks on the follow up button

  // 8. For the form submission, we need to set up a handler that will be called when the user submits the form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
        if (oppositionRef?.current) {
          oppositionRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef, oppositionRef]);

  // 9. Set up handler for when a submission is made, which will call the myAction function
  const handleSubmit = async (message: string, additionalMessage: string) => {
    if (!message || !additionalMessage) return;
    const test = await Decider(message, additionalMessage);
    console.log("content", test.choices[0].message.content);
    const content = JSON.parse(test.choices[0].message.content);
    console.log("Argument:", content.argument);

    if (content.argument) {
      await handleUserMessageSubmission(message);
    } else {
      console.log("Argument is false");
      setShowWebcam(true);
    }
  };
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const messageToSend = inputValue.trim();
    const OpMessageToSend = opposition.trim();
    if (!messageToSend || !OpMessageToSend) return;
    setInputValue("");
    setOpposition("");
    await handleSubmit(messageToSend, OpMessageToSend);
  };
  const handleUserMessageSubmission = async (
    userMessage: string
  ): Promise<void> => {
    const newMessageId = Date.now();
    const newMessage = {
      id: newMessageId,
      type: "userMessage",
      userMessage: userMessage,
      content: "",
      images: [],
      videos: [],
      followUp: null,
      isStreaming: true,
      searchResults: [] as SearchResult[],
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    let lastAppendedResponse = "";
    try {
      const streamableValue = await myAction(userMessage);
      let llmResponseString = "";
      for await (const message of readStreamableValue(streamableValue)) {
        const typedMessage = message as StreamMessage;
        setMessages((prevMessages) => {
          const messagesCopy = [...prevMessages];
          const messageIndex = messagesCopy.findIndex(
            (msg) => msg.id === newMessageId
          );
          if (messageIndex !== -1) {
            const currentMessage = messagesCopy[messageIndex];
            if (
              typedMessage.llmResponse &&
              typedMessage.llmResponse !== lastAppendedResponse
            ) {
              currentMessage.content += typedMessage.llmResponse;
              lastAppendedResponse = typedMessage.llmResponse; // Update last appended response
            }
            if (typedMessage.llmResponseEnd) {
              currentMessage.isStreaming = false;
            }
            if (typedMessage.searchResults) {
              currentMessage.searchResults = typedMessage.searchResults;
            }
            if (typedMessage.images) {
              currentMessage.images = [...typedMessage.images];
            }
            if (typedMessage.videos) {
              currentMessage.videos = [...typedMessage.videos];
            }
            if (typedMessage.followUp) {
              currentMessage.followUp = typedMessage.followUp;
            }
          }
          return messagesCopy;
        });
        if (typedMessage.llmResponse) {
          llmResponseString += typedMessage.llmResponse;
          setCurrentLlmResponse(llmResponseString);
        }
      }
    } catch (error) {
      console.error("Error streaming data for user message:", error);
    }
  };
  return (
    <div>
      <MessagesComponent
        messages={messages}
        currentLlmResponse={currentLlmResponse}
      />
      <div className="pb-[80px] pt-4 md:pt-10">
        {showWebcam && <Webcam />}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b duration-300 ease-in-out animate-in  peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]] mb-4">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-gray-100 rounded-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleFormSubmit(e);
                setCurrentLlmResponse("");
                if (window.innerWidth < 600) {
                  (e.target as HTMLFormElement)["message"]?.blur();
                }
                const value = inputValue.trim();
                setInputValue("");
                if (!value) return;
              }}
            >
              <div className="relative flex flex-col w-full overflow-hidden max-h-90 grow bg-gray-100 rounded-xl sm:border sm:px-2">
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Your Version..."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm  text-black"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Textarea
                  ref={oppositionRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Their Version..."
                  className="border-t min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm  text-black"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="opposition"
                  rows={1}
                  value={opposition}
                  onChange={(e) => setOpposition(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
