import { useState, useRef, useCallback, useEffect } from 'react';

const useTimer = (initialTime = 0) => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    // 타이머 시작
    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now() - time;

            intervalRef.current = setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 100); // 100ms 간격으로 업데이트
        }
    }, [isRunning, time]);

    // 타이머 일시정지
    const pause = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
            clearInterval(intervalRef.current);
        }
    }, [isRunning]);

    // 타이머 정지 (현재 시간 반환)
    const stop = useCallback(() => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        return time;
    }, [time]);

    // 타이머 리셋
    const reset = useCallback(() => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setTime(0);
        startTimeRef.current = null;
    }, []);

    // 클린업
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        time,
        isRunning,
        start,
        pause,
        stop,
        reset,
    };
};

export default useTimer;
