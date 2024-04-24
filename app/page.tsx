"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useActions, readStreamableValue } from "ai/rsc";
import { type AI } from "./action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";

import MessagesComponent from "@/components/message-list";
import Webcam from "@/components/webcam";
import InputComponent from "@/components/double-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";

const FormSchema = z.object({
  arguement: z
    .string()
    .min(10, {
      message: "Please enter your side",
    })
    .max(160, {
      message: "Please enter the oppositon.",
    }),
});

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
  const { myAction, Decider } = useActions<typeof AI>();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const oppositionRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [opposition, setOpposition] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLlmResponse, setCurrentLlmResponse] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // For the form submission, we need to set up a handler that will be called when the user submits the form
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

  // Set up handler for when a submission is made, which will call the myAction function
  const handleSubmit = async (message: string, additionalMessage: string) => {
    if (!message || !additionalMessage) return;
    const test = await Decider(message, additionalMessage);
    console.log("content", test.choices[0].message.content);
    const content = JSON.parse(test.choices[0].message.content);
    console.log("Argument:", content.argument);

    if (content.argument === true) {
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

      {!showWebcam && messages.length === 0 && (
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="px-4 py-2 space-y-4 border-t shadow-lg rounded-xl sm:border md:py-4 ">
            <Form {...form}>
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
                <InputComponent
                  inputRef={inputRef}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  oppositionRef={oppositionRef}
                  opposition={opposition}
                  setOpposition={setOpposition}
                  onKeyDown={onKeyDown}
                />
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
