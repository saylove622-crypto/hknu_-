import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import useTimer from '../hooks/useTimer';
import { GAME_CONFIG, STORAGE_KEYS } from '../data/constants';
import { saveBestTime, getBestTime } from '../utils/storage';

const GameContext = createContext(null);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    // 현재 스테이지
    const [currentStage, setCurrentStage] = useState(1);

    // 게임 상태
    const [gameStatus, setGameStatus] = useState('idle'); // idle | playing | paused | cleared

    // 클리어 타임
    const [clearTime, setClearTime] = useState(null);

    // 최고 기록 갱신 여부
    const [isNewRecord, setIsNewRecord] = useState(false);

    // 타이머
    const timer = useTimer(0);

    // 게임 시작
    const startGame = useCallback((stage = 1) => {
        setCurrentStage(stage);
        setGameStatus('playing');
        setClearTime(null);
        setIsNewRecord(false);
        timer.reset();
        timer.start();
    }, [timer]);

    // 게임 일시정지
    const pauseGame = useCallback(() => {
        setGameStatus('paused');
        timer.pause();
    }, [timer]);

    // 게임 재개
    const resumeGame = useCallback(() => {
        setGameStatus('playing');
        timer.start();
    }, [timer]);

    // 스테이지 클리어
    const clearStage = useCallback(() => {
        const finalTime = timer.stop();
        setGameStatus('cleared');
        setClearTime(finalTime);

        // 최고 기록 갱신 체크
        const isNew = saveBestTime(currentStage, finalTime);
        setIsNewRecord(isNew);

        return { time: finalTime, isNewRecord: isNew };
    }, [timer, currentStage]);

    // 다음 스테이지로
    const nextStage = useCallback(() => {
        if (currentStage < GAME_CONFIG.TOTAL_STAGES) {
            startGame(currentStage + 1);
            return true;
        }
        return false;
    }, [currentStage, startGame]);

    // 게임 리셋
    const resetGame = useCallback(() => {
        setCurrentStage(1);
        setGameStatus('idle');
        setClearTime(null);
        setIsNewRecord(false);
        timer.reset();
    }, [timer]);

    // 현재 스테이지 최고 기록
    const currentBestTime = useMemo(() => {
        return getBestTime(currentStage);
    }, [currentStage, gameStatus]); // gameStatus 변경 시 갱신

    const value = useMemo(() => ({
        // 상태
        currentStage,
        gameStatus,
        time: timer.time,
        isRunning: timer.isRunning,
        clearTime,
        isNewRecord,
        currentBestTime,

        // 액션
        startGame,
        pauseGame,
        resumeGame,
        clearStage,
        nextStage,
        resetGame,
    }), [
        currentStage,
        gameStatus,
        timer.time,
        timer.isRunning,
        clearTime,
        isNewRecord,
        currentBestTime,
        startGame,
        pauseGame,
        resumeGame,
        clearStage,
        nextStage,
        resetGame,
    ]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;
