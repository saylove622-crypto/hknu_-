import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import usePuzzle from '../hooks/usePuzzle';
import Header from '../components/layout/Header';
import Timer from '../components/common/Timer';
import PuzzleGrid from '../components/puzzle/PuzzleGrid';
import HintList from '../components/puzzle/HintList';
import { ROUTES } from '../data/constants';
import './GamePage.scss';

const GamePage = () => {
    const navigate = useNavigate();
    const { currentStage, gameStatus, time, isRunning, startGame, clearStage } = useGame();

    const {
        stageData,
        grid,
        hints,
        userInputs,
        completedCells,
        completedWords,
        activeCell,
        setActiveCell,
        selectedWordId,
        progress,
        isPuzzleComplete,
        handleCellInput,
        handleCellFocus,
        handleHintClick,
        wrongAttempts,
        extraHintShown,
        toggleExtraHint,
    } = usePuzzle(currentStage);

    // 게임 시작
    useEffect(() => {
        if (gameStatus === 'idle') {
            startGame(1);
        }
    }, [gameStatus, startGame]);

    // 퍼즐 완료 감지
    useEffect(() => {
        if (isPuzzleComplete && gameStatus === 'playing') {
            const result = clearStage();

            // 클리어 페이지로 이동
            setTimeout(() => {
                navigate(ROUTES.CLEAR, {
                    state: {
                        clearTime: result.time,
                        isNewRecord: result.isNewRecord,
                        stage: currentStage,
                    }
                });
            }, 500);
        }
    }, [isPuzzleComplete, gameStatus, clearStage, navigate, currentStage]);

    // 셀 키보드 네비게이션
    const handleCellKeyDown = useCallback((row, col) => {
        setActiveCell({ row, col });
    }, [setActiveCell]);

    if (!stageData) {
        return (
            <div className="game-page">
                <Header showBack title="" />
                <div className="game-page__loading">스테이지를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="game-page">
            <Header showBack />

            <main className="game-page__main">
                {/* 게임 헤더 */}
                <div className="game-page__header">
                    <div className="game-page__stage">
                        <span className="game-page__stage-badge">Stage {currentStage}</span>
                        <span className="game-page__stage-title">{stageData.title}</span>
                    </div>
                    <Timer time={time} isRunning={isRunning} size="medium" />
                </div>

                {/* 진행률 바 */}
                <div className="game-page__progress">
                    <div className="game-page__progress-bar">
                        <div
                            className="game-page__progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="game-page__progress-text">{progress}%</span>
                </div>

                {/* 게임 콘텐츠 */}
                <div className="game-page__content">
                    {/* 퍼즐 그리드 */}
                    <div className="game-page__puzzle">
                        <PuzzleGrid
                            grid={grid}
                            userInputs={userInputs}
                            completedCells={completedCells}
                            activeCell={activeCell}
                            selectedWordId={selectedWordId}
                            onCellInput={handleCellInput}
                            onCellFocus={handleCellFocus}
                            onCellKeyDown={handleCellKeyDown}
                        />
                    </div>

                    {/* 힌트 */}
                    <div className="game-page__hints">
                        <HintList
                            hints={hints}
                            completedWords={completedWords}
                            selectedWordId={selectedWordId}
                            onHintClick={handleHintClick}
                            wrongAttempts={wrongAttempts}
                            extraHintShown={extraHintShown}
                            onExtraHintToggle={toggleExtraHint}
                            stageData={stageData}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GamePage;
