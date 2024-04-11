import React from "react";
import SearchResultsComponent from "@/components/answer/SearchResultsComponent";
import UserMessageComponent from "@/components/answer/UserMessageComponent";
import LLMResponseComponent from "@/components/answer/LLMResponseComponent";
import ImagesComponent from "@/components/answer/ImagesComponent";
import VideosComponent from "@/components/answer/VideosComponent";

export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}

export interface Message {
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

export interface StreamMessage {
  searchResults?: any;
  userMessage?: string;
  llmResponse?: string;
  llmResponseEnd?: boolean;
  images?: any;
  videos?: any;
  followUp?: any;
}

export interface Image {
  link: string;
}

export interface Video {
  link: string;
  imageUrl: string;
}

export interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface MessagesComponentProps {
  messages: Message[];
  currentLlmResponse: string;
}

const MessagesComponent: React.FC<MessagesComponentProps> = ({
  messages,
  currentLlmResponse,
}) => {
  return (
    <div className="flex flex-col ">
      {messages.map((message, index) => (
        <div key={`message-${index}`} className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 md:pr-2">
            {message.searchResults && (
              <SearchResultsComponent
                key={`searchResults-${index}`}
                searchResults={message.searchResults}
              />
            )}
            {message.type === "userMessage" && (
              <UserMessageComponent message={message.userMessage} />
            )}
            <LLMResponseComponent
              llmResponse={message.content}
              currentLlmResponse={currentLlmResponse}
              index={index}
              key={`llm-response-${index}`}
            />
          </div>
          <div className="w-full md:w-1/4 lg:pl-2">
            {message.videos && (
              <VideosComponent
                key={`videos-${index}`}
                videos={message.videos}
              />
            )}
            {message.images && (
              <ImagesComponent
                key={`images-${index}`}
                images={message.images}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesComponent;
