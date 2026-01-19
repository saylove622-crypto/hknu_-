import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '../../data/constants';
import './PuzzleCell.scss';

const PuzzleCell = ({
    row,
    col,
    cellData,
    isActive,
    isHighlighted,
    isCompleted,
    userValue,
    onInput,
    onFocus,
    onKeyDown,
}) => {
    const [status, setStatus] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const inputRef = useRef(null);
    const isProcessingRef = useRef(false);

    const { answer, blocked } = cellData;

    // 활성화 시 포커스
    useEffect(() => {
        if (isActive && inputRef.current && !isCompleted) {
            inputRef.current.focus();
        }
    }, [isActive, isCompleted]);

    // 완료된 셀이면 값 초기화
    useEffect(() => {
        if (isCompleted) {
            setInputValue('');
        }
    }, [isCompleted]);

    // 정답 체크 및 피드백
    const checkAnswer = useCallback((value) => {
        if (isProcessingRef.current) return;
        if (!value || value.length === 0) return;

        isProcessingRef.current = true;

        // 마지막 글자 (완성된 한글)
        const inputChar = value.trim();

        // 한글이 완성되었는지 체크 (조합 중인 자음/모음만 있는 경우 제외)
        // 완성된 한글 유니코드 범위: AC00-D7A3
        const isCompleteHangul = /^[\uAC00-\uD7A3]$/.test(inputChar);

        if (!isCompleteHangul) {
            isProcessingRef.current = false;
            return;
        }

        const isCorrect = inputChar === answer;

        setStatus(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            setStatus(null);
            setInputValue('');
            isProcessingRef.current = false;

            if (isCorrect) {
                onInput(row, col, inputChar, true);
            } else {
                onInput(row, col, inputChar, false);
            }
        }, GAME_CONFIG.ANIMATION_DURATION.FEEDBACK);
    }, [answer, row, col, onInput]);

    // 입력 처리 - 조합 중에는 값만 업데이트
    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // 조합 중이 아닐 때만 체크 (영어 등)
        if (!isComposing && value) {
            checkAnswer(value);
        }
    };

    // 한글 조합 시작
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    // 한글 조합 완료 - 이때 정답 체크
    const handleCompositionEnd = (e) => {
        setIsComposing(false);
        const value = e.target.value || e.data;
        if (value) {
            checkAnswer(value);
        }
    };

    // 키보드 네비게이션
    const handleKeyDown = (e) => {
        // Enter 키로 강제 제출
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            checkAnswer(inputValue);
            return;
        }

        // Backspace로 입력 초기화
        if (e.key === 'Backspace') {
            setInputValue('');
        }

        if (onKeyDown) {
            onKeyDown(e, row, col);
        }
    };

    // 포커스 처리
    const handleFocus = () => {
        if (onFocus) {
            onFocus(row, col, cellData.wordIds);
        }
    };

    // 블록된 셀
    if (blocked) {
        return <div className="puzzle-cell puzzle-cell--blocked" aria-hidden="true" />;
    }

    // 클래스 조합
    const cellClasses = [
        'puzzle-cell',
        status === 'correct' && 'puzzle-cell--correct',
        status === 'incorrect' && 'puzzle-cell--incorrect',
        isActive && 'puzzle-cell--active',
        isHighlighted && 'puzzle-cell--highlighted',
        isCompleted && 'puzzle-cell--completed',
    ].filter(Boolean).join(' ');

    // 표시할 값 결정
    const displayValue = isCompleted ? answer : inputValue;

    return (
        <div className={cellClasses}>
            <input
                ref={inputRef}
                type="text"
                inputMode="text"
                disabled={isCompleted}
                value={displayValue}
                onChange={handleChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label={`${row + 1}행 ${col + 1}열`}
                aria-invalid={status === 'incorrect'}
            />
        </div>
    );
};

export default PuzzleCell;
