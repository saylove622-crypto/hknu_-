import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import Button from '../components/common/Button';
import { formatTime } from '../utils/formatTime';
import { submitRanking } from '../services/rankingService';
import { ROUTES, RANKING_CONFIG, GAME_CONFIG } from '../data/constants';
import './ClearPage.scss';

const ClearPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetGame, startGame } = useGame();

    const { clearTime = 0, isNewRecord = false, stage = 1 } = location.state || {};

    const [nickname, setNickname] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRank, setUserRank] = useState(null);
    const [showContent, setShowContent] = useState(false);

    // 다음 스테이지가 있는지 확인
    const hasNextStage = stage < GAME_CONFIG.TOTAL_STAGES;

    // 모든 스테이지 클리어 여부
    const isAllCleared = stage === GAME_CONFIG.TOTAL_STAGES;

    // 🎉 Confetti 효과
    const fireConfetti = useCallback(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const colors = ['#00CED1', '#1B3A6D', '#FFD700', '#22C55E', '#FFFFFF'];

        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            // 왼쪽에서 발사
            confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: colors,
            });

            // 오른쪽에서 발사
            confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: colors,
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // ALL CLEAR 시 더 화려한 효과
    const fireAllClearConfetti = useCallback(() => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#00CED1', '#1B3A6D', '#FFD700', '#22C55E', '#FF6B6B'],
        };

        const fire = (particleRatio, opts) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        };

        // 연속 발사로 폭발 효과
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });

        // 1초 후 추가 발사
        setTimeout(() => {
            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        }, 1000);

        // 2초 후 마무리
        setTimeout(() => {
            fire(0.15, { spread: 140, startVelocity: 35 });
        }, 2000);
    }, []);

    useEffect(() => {
        // 페이지 로드 시 confetti 발사
        const confettiTimer = setTimeout(() => {
            if (isAllCleared) {
                fireAllClearConfetti();
            } else {
                fireConfetti();
            }
        }, 300);

        // 콘텐츠 표시 딜레이
        const contentTimer = setTimeout(() => {
            setShowContent(true);
        }, 800);

        return () => {
            clearTimeout(confettiTimer);
            clearTimeout(contentTimer);
        };
    }, [isAllCleared, fireConfetti, fireAllClearConfetti]);

    // 랭킹 등록
    const handleSubmitRanking = async () => {
        if (!nickname.trim()) {
            alert('닉네임을 입력해주세요!');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitRanking(stage, nickname.trim(), clearTime);
            setUserRank(result.rank);
            setIsSubmitted(true);

            // 랭킹 등록 시 추가 confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500'],
            });
        } catch (error) {
            console.error('랭킹 등록 오류:', error);
            alert('랭킹 등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 다음 스테이지
    const handleNextStage = () => {
        startGame(stage + 1);
        navigate(ROUTES.GAME);
    };

    // 다시 하기 (현재 스테이지)
    const handleRetry = () => {
        startGame(stage);
        navigate(ROUTES.GAME);
    };

    // 메인으로
    const handleGoMain = () => {
        resetGame();
        navigate(ROUTES.HOME);
    };

    // 랭킹 보기
    const handleViewRanking = () => {
        navigate(ROUTES.RANKING);
    };

    return (
        <div className="clear-page">
            {/* CLEAR 타이틀 */}
            <div className="clear-page__title-wrap">
                <h1 className="clear-page__title">
                    <span className="clear-page__emoji">🎉</span>
                    <span className="clear-page__text">
                        {isAllCleared ? 'ALL CLEAR!' : 'CLEAR!'}
                    </span>
                    <span className="clear-page__emoji">🎉</span>
                </h1>

                {isNewRecord && (
                    <div className="clear-page__new-record">
                        ✨ NEW RECORD! ✨
                    </div>
                )}

                {isAllCleared && (
                    <div className="clear-page__all-clear">
                        🏆 모든 스테이지를 클리어했습니다! 🏆
                    </div>
                )}
            </div>

            {/* 클리어 타임 */}
            <div className="clear-page__time">
                <span className="clear-page__time-label">클리어 타임</span>
                <span className="clear-page__time-value">{formatTime(clearTime)}</span>
            </div>

            {/* 콘텐츠 */}
            {showContent && (
                <div className="clear-page__content">
                    {/* 스테이지 배지 */}
                    <div className="clear-page__stage">
                        <span className="clear-page__stage-badge">Stage {stage}</span>
                        <span className="clear-page__stage-text">Complete!</span>
                    </div>

                    {/* 다음 스테이지 버튼 (있을 경우) */}
                    {hasNextStage && (
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleNextStage}
                            fullWidth
                            className="clear-page__next-stage-btn"
                        >
                            🚀 Stage {stage + 1} 도전하기
                        </Button>
                    )}

                    {/* 랭킹 등록 폼 */}
                    {!isSubmitted ? (
                        <div className="clear-page__form">
                            <input
                                type="text"
                                className="clear-page__input"
                                placeholder="닉네임 입력 (최대 10자)"
                                maxLength={RANKING_CONFIG.NICKNAME_MAX_LENGTH}
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitRanking()}
                            />
                            <Button
                                variant="secondary"
                                onClick={handleSubmitRanking}
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '⏳ 등록 중...' : '🏆 랭킹 등록'}
                            </Button>
                        </div>
                    ) : (
                        <div className="clear-page__submitted">
                            {userRank ? (
                                <p className="clear-page__rank-message">
                                    🎊 축하합니다! <strong>{userRank}위</strong>에 등록되었습니다!
                                </p>
                            ) : (
                                <p className="clear-page__rank-message">
                                    기록이 저장되었습니다!
                                </p>
                            )}
                            <Button variant="secondary" onClick={handleViewRanking} fullWidth>
                                🏆 랭킹 보기
                            </Button>
                        </div>
                    )}

                    {/* 버튼 그룹 */}
                    <div className="clear-page__buttons">
                        <Button variant="ghost" onClick={handleRetry}>
                            🔄 다시 하기
                        </Button>
                        <Button variant="ghost" onClick={handleGoMain}>
                            🏠 메인으로
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClearPage;
