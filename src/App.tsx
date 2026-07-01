/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import './App.scss';

const NAMES_SEQUENCE = ['Clock-0', 'Clock-4900', 'Clock-8200', 'Clock-1500'];
const START_TIME_STR = '09:32:31';

export const App: React.FC = () => {
  const [time, setTime] = useState<string>(START_TIME_STR);
  const [nameIndex, setNameIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const isVisibleRef = useRef<boolean>(isVisible);
  const startTimeRef = useRef<number>(Date.now());
  const lastLoggedSecondRef = useRef<number>(-1);
  const lastLoggedWarnRef = useRef<number>(-1);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTimeRef.current;

      const totalSeconds = Math.floor(elapsedMs / 1000);

      const [hours, minutes, seconds] = START_TIME_STR.split(':').map(Number);
      const targetDate = new Date();

      targetDate.setHours(hours, minutes, seconds + totalSeconds);
      const currentTimeStr = targetDate.toTimeString().split(' ')[0];

      setTime(currentTimeStr);

      if (
        isVisibleRef.current &&
        totalSeconds > 0 &&
        totalSeconds > lastLoggedSecondRef.current
      ) {
        console.log(currentTimeStr);
        lastLoggedSecondRef.current = totalSeconds;
      }

      const totalWarns = Math.floor(elapsedMs / 3300);
      const currentIdx = totalWarns % NAMES_SEQUENCE.length;

      setNameIndex(currentIdx);

      if (
        isVisibleRef.current &&
        totalWarns > 0 &&
        totalWarns > lastLoggedWarnRef.current
      ) {
        const prevIdx = (totalWarns - 1) % NAMES_SEQUENCE.length;

        console.warn(
          `Renamed from ${NAMES_SEQUENCE[prevIdx]} to ${NAMES_SEQUENCE[currentIdx]}`,
        );
        lastLoggedWarnRef.current = totalWarns;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleLeftClick = () => {
      setIsVisible(true);
    };

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      setIsVisible(false);
    };

    window.addEventListener('click', handleLeftClick);
    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('click', handleLeftClick);
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <div className="app" style={{ minHeight: '100vh' }}>
      {isVisible && (
        <div className="Clock">
          <h1 className="Clock__name">{NAMES_SEQUENCE[nameIndex]}</h1>
          <div className="Clock__time">{time}</div>
        </div>
      )}
    </div>
  );
};

export default App;
