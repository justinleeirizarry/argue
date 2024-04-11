// 1. Interface defining the props for UserMessageComponent, expecting a 'message' of type string.
interface UserMessageComponentProps {
  message: string;
}

// 2. UserMessageComponent functional component that renders a message within styled div elements.
const UserMessageComponent: React.FC<UserMessageComponentProps> = ({
  message,
}) => {
  return (
    <div className=" bg-white shadow-lg border rounded-lg p-4 mt-8">
      <div className="flex items-center ">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 text-4xl font-black flex-grow  text-black uppercase">
          {message}!
        </h2>
      </div>
    </div>
  );
};

export default UserMessageComponent;
