// 1. Interface defining the props for UserMessageComponent, expecting a 'message' of type string.
interface UserMessageComponentProps {
  message: string;
}

// 2. UserMessageComponent functional component that renders a message within styled div elements.
const UserMessageComponent: React.FC<UserMessageComponentProps> = ({
  message,
}) => {
  return (
    <div className="flex flex-row justify-start bg-white shadow-lg border rounded-lg p-4 mt-8">
      <div className=" items-center ">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 text-5xl font-black flex-grow  text-black uppercase">
          {message}!
        </h2>
        <h3 className="uppercase text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
          Here's why you are correct:
        </h3>
      </div>
    </div>
  );
};

export default UserMessageComponent;
