import React, { RefObject } from "react";
import { Textarea } from "./ui/textarea";

interface InputComponentProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  oppositionRef: RefObject<HTMLTextAreaElement>;
  opposition: string;
  setOpposition: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  inputRef,
  inputValue,
  setInputValue,
  oppositionRef,
  opposition,
  setOpposition,
  onKeyDown,
}) => {
  return (
    <div className="relative flex flex-col justify-center align-middle w-full overflow-hidden  grow bg-red-300 h-[40rem] gap-20 rounded-xl sm:border sm:px-2">
      <h2>Your Side</h2>
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
      <h2>Your Side</h2>
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
  );
};

export default InputComponent;
