import { useEffect, useRef, useState } from 'react';

export default function TimerRing({ duration, onExpire, isActive, key: resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive, resetKey]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const strokeDashoffset = circumference * (1 - progress);

  const color = progress > 0.5 ? '#00e5c4' : progress > 0.25 ? '#ff9933' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(220 14% 16%)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="text-2xl font-bold font-grotesk z-10 tabular-nums"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}