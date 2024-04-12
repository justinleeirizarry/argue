import Webcam from "react-webcam";

const WebcamComponent = () => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div>
      <h1 className=" mb-10 text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
        Why you are wrong{" "}
      </h1>
      <Webcam
        className="rounded-xl h-[35rem]"
        videoConstraints={videoConstraints}
      />
    </div>
  );
};

export default WebcamComponent;
