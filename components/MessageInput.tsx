import { RefObject } from "react";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IconArrowElbow } from "./ui/icons";
import { Button } from "./ui/button";

interface MessageInputComponentProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInputComponent: React.FC<MessageInputComponentProps> = ({
  inputRef,
  inputValue,
  setInputValue,
  onKeyDown,
}) => {
  return (
    <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow  bg-gray-100 rounded-full sm:border sm:px-2">
      <Textarea
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        placeholder="Send a message."
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
      <div className="absolute right-0 top-4 sm:right-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="submit" size="icon" disabled={inputValue === ""}>
              <IconArrowElbow />
              <span className="sr-only">Send message</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default MessageInputComponent;
