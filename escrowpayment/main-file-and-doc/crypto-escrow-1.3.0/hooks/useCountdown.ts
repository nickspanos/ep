import { useEffect, useMemo, useState } from "react";

export const useCountdown = (date: Date) => {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

    const isExpired = useMemo(() => !remainingSeconds, [remainingSeconds]);

    const timer = useMemo(() => {
        let seconds = remainingSeconds

        let days = Math.floor(seconds / (24*3600))
        seconds -= days * (24*3600)

        let hours = Math.floor(seconds / 3600)
        seconds -= hours * 3600

        let minutes = Math.floor(seconds / 60)
        seconds -= minutes * 60

        seconds = Math.floor(seconds)

        let formatted = seconds.toString().padStart(2, "0") + 's'

        if (minutes) {
            formatted = minutes.toString().padStart(2, "0") + 'm ' + formatted
        }

        if (hours) {
            formatted = hours.toString().padStart(2, "0") + 'h ' + formatted
        }

        if (days) {
            formatted = days.toString().padStart(2, "0") + 'd ' + formatted
        }

        return {days, hours, minutes, seconds, formatted}
    }, [remainingSeconds])
    
    useEffect(() => {
        const secs = (date.getTime() - (new Date).getTime())/1000
        if (secs) {
            setRemainingSeconds(secs > 0?secs:0)
            const interval = setInterval(() => {
                if (remainingSeconds > 0) {
                    setRemainingSeconds(seconds => seconds - 1);
                }
            }, 1000);
        
            return () => clearInterval(interval);
        }
    }, [date]);
    
    return {timer, isExpired};
}