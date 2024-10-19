import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const VideoPlayer = ({ videoSrc, videoThumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <>
      {!isPlaying ? (
        <div style={{ position: "relative", cursor: "pointer" }}>
          <img
            src={videoThumbnail}
            alt="Video thumbnail"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
            onClick={() => handlePlay()}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
              borderRadius: "50%",
              padding: "10px",
            }}
          >
            <PlayArrowIcon
              onClick={() => handlePlay()}
              style={{
                fontSize: "90px",
                color: "#fff",
              }}
            />
          </div>
        </div>
      ) : (
        <video
          autoPlay
          controls
          src={videoSrc}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: 800,
            borderRadius: "8px",
          }}
        />
      )}
    </>
  );
};

export default VideoPlayer;
