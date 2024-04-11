import React, { RefObject } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

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
    <div className="grid w-full gap-8">
      <Label className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 text-6xl font-black flex-grow  text-black uppercase">
        Your Side
      </Label>
      <Textarea
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        placeholder=""
        className="text-xl"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        name="message"
        rows={1}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <Label className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-6xl font-black flex-grow  uppercase">
        Their Side
      </Label>
      <Textarea
        ref={oppositionRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        placeholder=""
        className="text-xl"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        name="opposition"
        rows={1}
        value={opposition}
        onChange={(e) => setOpposition(e.target.value)}
      />
      <Button className="font-black text-3xl p-8 " type="submit" size="lg">
        Find Out
      </Button>
    </div>
  );
};
export default InputComponent;
