import React from 'react';
import './HintList.scss';

const HintList = ({
    hints,
    completedWords,
    selectedWordId,
    onHintClick,
    wrongAttempts = {},
    extraHintShown = {},
    onExtraHintToggle,
    stageData
}) => {
    const { across, down } = hints;

    // 단어 정보 가져오기
    const getWordText = (wordId) => {
        if (!stageData) return '';
        const word = stageData.words.find(w => w.id === wordId);
        return word ? word.text : '';
    };

    // 단어의 절반 글자 가져오기 (앞 절반)
    const getHalfWord = (wordId) => {
        const text = getWordText(wordId);
        const halfLength = Math.ceil(text.length / 2);
        return text.slice(0, halfLength);
    };

    const renderHintItem = (hint, direction) => {
        const isCompleted = completedWords.has(hint.wordId);
        const isSelected = selectedWordId === hint.wordId;
        const hasWrongAttempt = (wrongAttempts[hint.wordId] || 0) >= 1;
        const showExtraHint = extraHintShown[hint.wordId];

        return (
            <li
                key={hint.wordId}
                className={`hint-list__item ${isCompleted ? 'hint-list__item--completed' : ''} ${isSelected ? 'hint-list__item--selected' : ''}`}
            >
                <div
                    className="hint-list__main"
                    onClick={() => onHintClick && onHintClick(hint.wordId, direction)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onHintClick && onHintClick(hint.wordId, direction)}
                >
                    <span className="hint-list__number">{hint.number}</span>
                    <span className="hint-list__text">{hint.hint}</span>
                    <span className="hint-list__length">({hint.length}자)</span>
                    {isCompleted && <span className="hint-list__check">✓</span>}
                </div>

                {/* 추가 힌트 버튼: 1회 이상 틀린 경우에만 표시 */}
                {hasWrongAttempt && !isCompleted && (
                    <div className="hint-list__extra">
                        <button
                            className={`hint-list__extra-btn ${showExtraHint ? 'hint-list__extra-btn--active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onExtraHintToggle && onExtraHintToggle(hint.wordId);
                            }}
                            title="추가 힌트 보기"
                        >
                            ❓
                        </button>
                        {showExtraHint && (
                            <div className="hint-list__extra-answer">
                                <span className="hint-list__extra-label">정답 힌트:</span>
                                <span className="hint-list__extra-text">{getHalfWord(hint.wordId)}</span>
                                <span className="hint-list__extra-dots">{'●'.repeat(hint.length - Math.ceil(getWordText(hint.wordId).length / 2))}</span>
                            </div>
                        )}
                    </div>
                )}
            </li>
        );
    };

    return (
        <div className="hint-list">
            {/* 가로 힌트 */}
            {across.length > 0 && (
                <div className="hint-list__section">
                    <h3 className="hint-list__title">
                        <span className="hint-list__title-icon">→</span>
                        가로
                    </h3>
                    <ul className="hint-list__items">
                        {across.map((hint) => renderHintItem(hint, 'across'))}
                    </ul>
                </div>
            )}

            {/* 세로 힌트 */}
            {down.length > 0 && (
                <div className="hint-list__section">
                    <h3 className="hint-list__title">
                        <span className="hint-list__title-icon">↓</span>
                        세로
                    </h3>
                    <ul className="hint-list__items">
                        {down.map((hint) => renderHintItem(hint, 'down'))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HintList;
