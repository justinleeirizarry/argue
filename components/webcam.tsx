import Webcam from "react-webcam";

const WebcamComponent = () => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="container">
      <h1 className="text-7xl font-black ">Why you are wrong </h1>
      <Webcam videoConstraints={videoConstraints} />
    </div>
  );
};

export default WebcamComponent;
