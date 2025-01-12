"use client";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";

function Timer({
  dead_line,
  currentDate,
}: {
  dead_line: number;
  currentDate: number;
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const dayDifference = dead_line - currentDate;

      let remainingTime = 0;
      let days = 0;

      if (dayDifference === 0) {
        // Calculate time remaining for today until midnight
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set to midnight
        remainingTime = midnight.getTime() - now.getTime();
      } else if (dayDifference > 0) {
        // Include full days and remaining time for the last day
        days = dayDifference - 1; // Subtract one full day
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set to midnight
        remainingTime = midnight.getTime() - now.getTime();
      }

      // Convert remainingTime (milliseconds) to hours, minutes, and seconds
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );

      // Build the time string dynamically
      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);

      setTimeLeft(parts.join(" ")); // Join the parts with a space
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every minute for better performance
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer); // Cleanup
  }, [dead_line, currentDate]);

  return (
    <Badge
      variant={"secondary"}
      className="absolute bottom-2 right-2 z-30 py-2 px-3 bg-background hover:bg-background"
    >
      {timeLeft}
    </Badge>
  );
}

export default Timer;
