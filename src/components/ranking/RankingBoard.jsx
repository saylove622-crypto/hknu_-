import React from 'react';
import { formatTime } from '../../utils/formatTime';
import './RankingBoard.scss';

const RankingBoard = ({ ranking, currentUserRank = null }) => {
    if (!ranking || ranking.length === 0) {
        return (
            <div className="ranking-board ranking-board--empty">
                <p>아직 기록이 없습니다.</p>
                <p>첫 번째 기록의 주인공이 되어보세요! 🏆</p>
            </div>
        );
    }

    const getMedalEmoji = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `${rank}`;
        }
    };

    return (
        <div className="ranking-board">
            <ul className="ranking-board__list">
                {ranking.map((record, index) => {
                    const rank = index + 1;
                    const isCurrentUser = currentUserRank === rank;

                    return (
                        <li
                            key={`${record.nickname}-${record.time}-${index}`}
                            className={`ranking-board__item ${isCurrentUser ? 'ranking-board__item--current' : ''}`}
                        >
                            <span className="ranking-board__rank">
                                {getMedalEmoji(rank)}
                            </span>
                            <span className="ranking-board__nickname">
                                {record.nickname}
                            </span>
                            <span className="ranking-board__time">
                                {formatTime(record.time)}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RankingBoard;
