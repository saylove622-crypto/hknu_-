import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Button from '../components/common/Button';
import { ROUTES, GAME_CONFIG } from '../data/constants';
import { puzzleStages } from '../data/puzzleData';
import { getBestTime } from '../utils/storage';
import { formatTime } from '../utils/formatTime';
import './MainPage.scss';

const MainPage = () => {
    const navigate = useNavigate();
    const { startGame } = useGame();

    // 각 스테이지 최고 기록
    const stageBestTimes = {};
    for (let i = 1; i <= GAME_CONFIG.TOTAL_STAGES; i++) {
        stageBestTimes[i] = getBestTime(i);
    }

    // 스테이지 시작
    const handleStartStage = (stageNum) => {
        startGame(stageNum);
        navigate(ROUTES.GAME);
    };

    return (
        <div className="main-page">
            {/* 배경 장식 */}
            <div className="main-page__bg-decor">
                <span className="main-page__bg-circle main-page__bg-circle--1" />
                <span className="main-page__bg-circle main-page__bg-circle--2" />
                <span className="main-page__bg-circle main-page__bg-circle--3" />
            </div>

            {/* 히어로 섹션 */}
            <section className="main-page__hero">
                <div className="main-page__mascot">🐯</div>
                <h1 className="main-page__title">
                    한경 워드퍼즐
                </h1>
                <p className="main-page__subtitle">
                    한경국립대학교를 얼마나 알고 있나요?
                </p>
            </section>

            {/* 스테이지 선택 섹션 */}
            <section className="main-page__stages">
                <h2 className="main-page__stages-title">🎮 스테이지 선택</h2>
                <div className="main-page__stages-grid">
                    {Object.values(puzzleStages).map((stage) => {
                        const bestTime = stageBestTimes[stage.id];
                        const isCleared = !!bestTime;

                        return (
                            <div
                                key={stage.id}
                                className={`main-page__stage-card ${isCleared ? 'main-page__stage-card--cleared' : ''}`}
                                onClick={() => handleStartStage(stage.id)}
                            >
                                <div className="main-page__stage-header">
                                    <span className="main-page__stage-badge">Stage {stage.id}</span>
                                    {isCleared && <span className="main-page__stage-check">✓</span>}
                                </div>
                                <h3 className="main-page__stage-name">{stage.title}</h3>
                                <div className="main-page__stage-info">
                                    <span className="main-page__stage-difficulty">
                                        {stage.difficulty === 'easy' ? '🟢 기초' : '🔴 심화'}
                                    </span>
                                    <span className="main-page__stage-words">
                                        {stage.words.length}개 단어
                                    </span>
                                </div>
                                {bestTime && (
                                    <div className="main-page__stage-record">
                                        🏆 {formatTime(bestTime)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 퀵 액션 */}
            <section className="main-page__actions">
                <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => handleStartStage(1)}
                >
                    🚀 Stage 1부터 시작
                </Button>

                <Link to={ROUTES.RANKING}>
                    <Button variant="secondary" size="large" fullWidth>
                        🏆 랭킹 보기
                    </Button>
                </Link>
            </section>

            {/* 정보 섹션 */}
            <section className="main-page__info">
                <div className="main-page__info-card">
                    <span className="main-page__info-icon">📝</span>
                    <h3>게임 방법</h3>
                    <p>힌트를 보고 한경국립대 관련 단어를 맞춰보세요!</p>
                </div>
                <div className="main-page__info-card">
                    <span className="main-page__info-icon">⏱️</span>
                    <h3>시간 도전</h3>
                    <p>최대한 빠르게 퍼즐을 완성하세요!</p>
                </div>
                <div className="main-page__info-card">
                    <span className="main-page__info-icon">🎯</span>
                    <h3>랭킹 등록</h3>
                    <p>TOP 5 랭킹에 이름을 올려보세요!</p>
                </div>
            </section>

            {/* 푸터 */}
            <footer className="main-page__footer">
                <p className="main-page__version">v1.2.0</p>
                <p>© 2026 안티그래비티 | 한경국립대학교</p>
            </footer>
        </div>
    );
};

export default MainPage;
