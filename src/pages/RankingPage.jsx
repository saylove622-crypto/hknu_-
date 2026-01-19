import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import RankingBoard from '../components/ranking/RankingBoard';
import Button from '../components/common/Button';
import { fetchRanking } from '../services/rankingService';
import { ROUTES } from '../data/constants';
import { puzzleStages } from '../data/puzzleData';
import './RankingPage.scss';

const RankingPage = () => {
    const [activeStage, setActiveStage] = useState(1);
    const [ranking, setRanking] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocal, setIsLocal] = useState(false);
    const currentStageData = puzzleStages[activeStage];

    // 랭킹 데이터 가져오기
    useEffect(() => {
        const loadRanking = async () => {
            setIsLoading(true);
            const result = await fetchRanking(activeStage, 10);
            setRanking(result.data);
            setIsLocal(result.isLocal);
            setIsLoading(false);
        };

        loadRanking();
    }, [activeStage]);

    return (
        <div className="ranking-page">
            <Header showBack />

            <main className="ranking-page__main">
                <div className="ranking-page__header">
                    <h1 className="ranking-page__title">
                        <span className="ranking-page__title-icon">🏆</span>
                        랭킹
                    </h1>
                    <p className="ranking-page__subtitle">
                        {currentStageData ? currentStageData.title : `Stage ${activeStage}`}
                    </p>
                    {/* 온라인/오프라인 상태 표시 */}
                    <span className={`ranking-page__status ${isLocal ? 'ranking-page__status--local' : 'ranking-page__status--online'}`}>
                        {isLocal ? '📴 로컬' : '🌐 온라인'}
                    </span>
                </div>

                {/* 스테이지 탭 */}
                <div className="ranking-page__tabs">
                    {Object.values(puzzleStages).map((stage) => (
                        <button
                            key={stage.id}
                            className={`ranking-page__tab ${activeStage === stage.id ? 'ranking-page__tab--active' : ''}`}
                            onClick={() => setActiveStage(stage.id)}
                        >
                            Stage {stage.id}
                        </button>
                    ))}
                </div>

                <div className="ranking-page__board">
                    {isLoading ? (
                        <div className="ranking-page__loading">
                            <span className="ranking-page__spinner">⏳</span>
                            <p>랭킹을 불러오는 중...</p>
                        </div>
                    ) : (
                        <RankingBoard ranking={ranking} />
                    )}
                </div>

                <div className="ranking-page__actions">
                    <Link to={ROUTES.GAME}>
                        <Button variant="primary" size="large" fullWidth>
                            🎮 게임 시작
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default RankingPage;
