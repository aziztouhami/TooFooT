import React, { useEffect, useState, useRef } from 'react';
import './Timer.css';

const Timer = ({ timer,setTimer, onTimeout, videoSrc }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      onTimeout(); 
    }
  }, [timer, onTimeout]);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const videoDuration = videoElement.duration;
      if (videoDuration) {
        const newTime = Math.max(0, Math.min((60 - timer) % videoDuration, videoDuration - 1));
        videoElement.currentTime = newTime;
      }
    }
  }, [timer]);

  return (
    <div className="timer-container">
      <div className="timer-video">
        <video ref={videoRef} src={videoSrc} autoPlay loop ></video>
      </div>
      <h2 className={`time-remaining ${timer <= 10 ? 'critical' : ''}`}>
        {timer}
      </h2>
    </div>
  );
};

export default Timer;
