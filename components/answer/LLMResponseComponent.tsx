// 1. Define the 'LLMResponseComponentProps' interface with properties for 'llmResponse', 'currentLlmResponse', and 'index'
interface LLMResponseComponentProps {
  llmResponse: string;
  currentLlmResponse: string;
  index: number;
}

// 2. Import the 'Markdown' component from 'react-markdown'
import Markdown from "react-markdown";

// 3. Define the 'StreamingComponent' functional component that renders the 'currentLlmResponse'
const StreamingComponent = ({
  currentLlmResponse,
}: {
  currentLlmResponse: string;
}) => {
  return (
    <>
      {currentLlmResponse && (
        <div className=" bg-white shadow-lg border rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold flex-grow  text-black">
              Why you are correct
            </h2>
          </div>
          <div className=" text-gray-800">{currentLlmResponse}</div>
        </div>
      )}
    </>
  );
};

// 4. Define the 'LLMResponseComponent' functional component that takes 'llmResponse', 'currentLlmResponse', and 'index' as props
const LLMResponseComponent = ({
  llmResponse,
  currentLlmResponse,
  index,
}: LLMResponseComponentProps) => {
  // 5. Check if 'llmResponse' is not empty
  const hasLlmResponse = llmResponse && llmResponse.trim().length > 0;

  return (
    <>
      {hasLlmResponse ? (
        // 6. If 'llmResponse' is not empty, render a div with the 'Markdown' component
        <div className=" bg-white shadow-lg border rounded-lg p-12 mt-4">
          <div className="flex items-center"></div>
          <div className=" text-gray-800">
            <Markdown>{llmResponse}</Markdown>
          </div>
        </div>
      ) : (
        // 7. If 'llmResponse' is empty, render the 'StreamingComponent' with 'currentLlmResponse'
        <StreamingComponent currentLlmResponse={currentLlmResponse} />
      )}
    </>
  );
};

export default LLMResponseComponent;
