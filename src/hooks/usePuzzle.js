import { useState, useCallback, useMemo, useEffect } from 'react';
import { getStageData } from '../data/puzzleData';
import { generateGrid, generateHints, getTotalCellCount } from '../utils/generateGrid';

const usePuzzle = (stageNumber) => {
    const stageData = useMemo(() => getStageData(stageNumber), [stageNumber]);

    // 그리드 자동 생성
    const grid = useMemo(() => {
        if (!stageData) return [];
        return generateGrid(stageData);
    }, [stageData]);

    // 힌트 생성
    const hints = useMemo(() => {
        if (!stageData) return { across: [], down: [] };
        return generateHints(stageData.words);
    }, [stageData]);

    // 사용자 입력 상태 (row-col: value 형태)
    const [userInputs, setUserInputs] = useState({});

    // 완료된 셀 목록
    const [completedCells, setCompletedCells] = useState(new Set());

    // 완료된 단어 목록
    const [completedWords, setCompletedWords] = useState(new Set());

    // 현재 활성 셀
    const [activeCell, setActiveCell] = useState(null);

    // 현재 선택된 단어 ID
    const [selectedWordId, setSelectedWordId] = useState(null);

    // 현재 이동 방향 (across 또는 down)
    const [currentDirection, setCurrentDirection] = useState('across');

    // 단어별 오답 횟수 (wordId: count)
    const [wrongAttempts, setWrongAttempts] = useState({});

    // 추가 힌트 표시 상태 (wordId: boolean)
    const [extraHintShown, setExtraHintShown] = useState({});

    // 총 입력해야 하는 셀 수
    const totalCells = useMemo(() => {
        return getTotalCellCount(grid);
    }, [grid]);

    // 단어 정보 가져오기
    const getWordInfo = useCallback((wordId) => {
        if (!stageData) return null;
        return stageData.words.find(w => w.id === wordId);
    }, [stageData]);

    // 정답 체크
    const checkAnswer = useCallback((row, col, value) => {
        if (!grid[row] || !grid[row][col]) return false;

        const cell = grid[row][col];
        if (cell.blocked) return false;

        return cell.answer === value;
    }, [grid]);

    // 다음 셀 찾기 (같은 단어 내에서)
    const findNextCellInWord = useCallback((row, col, wordId) => {
        const word = getWordInfo(wordId);
        if (!word) return null;

        const direction = word.direction;
        let nextRow = row;
        let nextCol = col;

        if (direction === 'across') {
            nextCol = col + 1;
        } else {
            nextRow = row + 1;
        }

        // 범위 체크 및 같은 단어인지 확인
        if (nextRow < grid.length && nextCol < grid[0].length) {
            const nextCell = grid[nextRow][nextCol];
            if (!nextCell.blocked && nextCell.wordIds?.includes(wordId)) {
                // 아직 완료되지 않은 셀인지 확인
                const cellKey = `${nextRow}-${nextCol}`;
                if (!completedCells.has(cellKey)) {
                    return { row: nextRow, col: nextCol };
                }
            }
        }

        return null;
    }, [grid, getWordInfo, completedCells]);

    // 다음 미완성 셀 찾기 (전체에서)
    const findNextIncompleteCell = useCallback((startRow, startCol) => {
        // 현재 위치부터 순회
        for (let row = startRow; row < grid.length; row++) {
            const startColIdx = row === startRow ? startCol + 1 : 0;
            for (let col = startColIdx; col < grid[row].length; col++) {
                if (!grid[row][col].blocked) {
                    const cellKey = `${row}-${col}`;
                    if (!completedCells.has(cellKey)) {
                        return { row, col };
                    }
                }
            }
        }

        // 처음부터 다시 순회
        for (let row = 0; row <= startRow; row++) {
            const endColIdx = row === startRow ? startCol : grid[row].length;
            for (let col = 0; col < endColIdx; col++) {
                if (!grid[row][col].blocked) {
                    const cellKey = `${row}-${col}`;
                    if (!completedCells.has(cellKey)) {
                        return { row, col };
                    }
                }
            }
        }

        return null;
    }, [grid, completedCells]);

    // 다음 셀로 이동
    const moveToNextCell = useCallback((row, col) => {
        // 현재 선택된 단어 내에서 다음 셀 찾기
        if (selectedWordId) {
            const nextInWord = findNextCellInWord(row, col, selectedWordId);
            if (nextInWord) {
                setActiveCell(nextInWord);
                return nextInWord;
            }
        }

        // 단어 끝에 도달하면 다음 미완성 셀로 이동
        const nextIncomplete = findNextIncompleteCell(row, col);
        if (nextIncomplete) {
            setActiveCell(nextIncomplete);
            // 새 셀의 단어로 선택 변경
            const nextCell = grid[nextIncomplete.row][nextIncomplete.col];
            if (nextCell.wordIds?.length > 0) {
                setSelectedWordId(nextCell.wordIds[0]);
                const word = getWordInfo(nextCell.wordIds[0]);
                if (word) {
                    setCurrentDirection(word.direction);
                }
            }
            return nextIncomplete;
        }

        return null;
    }, [selectedWordId, findNextCellInWord, findNextIncompleteCell, grid, getWordInfo]);

    // 셀 입력 처리
    const handleCellInput = useCallback((row, col, value, isCorrect) => {
        const cellKey = `${row}-${col}`;

        if (isCorrect) {
            // 정답인 경우
            setUserInputs(prev => ({ ...prev, [cellKey]: value }));
            setCompletedCells(prev => new Set([...prev, cellKey]));

            // 단어 완성 체크
            const cell = grid[row]?.[col];
            if (cell && cell.wordIds) {
                cell.wordIds.forEach(wordId => {
                    // 새로운 completedCells로 체크
                    const newCompletedCells = new Set([...completedCells, cellKey]);

                    const word = stageData?.words.find(w => w.id === wordId);
                    if (word) {
                        let allCompleted = true;
                        for (let i = 0; i < word.text.length; i++) {
                            const r = word.direction === 'down' ? word.row + i : word.row;
                            const c = word.direction === 'across' ? word.col + i : word.col;
                            if (!newCompletedCells.has(`${r}-${c}`)) {
                                allCompleted = false;
                                break;
                            }
                        }

                        if (allCompleted) {
                            setCompletedWords(prev => new Set([...prev, wordId]));
                        }
                    }
                });
            }

            // 다음 셀로 자동 이동
            setTimeout(() => {
                moveToNextCell(row, col);
            }, 50);
        } else {
            // 오답인 경우: 해당 셀에 속한 모든 단어의 오답 횟수 증가
            const cell = grid[row]?.[col];
            if (cell && cell.wordIds) {
                cell.wordIds.forEach(wordId => {
                    setWrongAttempts(prev => ({
                        ...prev,
                        [wordId]: (prev[wordId] || 0) + 1
                    }));
                });
            }
        }

        return isCorrect;
    }, [grid, stageData, completedCells, moveToNextCell]);

    // 셀 포커스 처리
    const handleCellFocus = useCallback((row, col, wordIds) => {
        setActiveCell({ row, col });
        if (wordIds && wordIds.length > 0) {
            // 현재 방향에 맞는 단어 선택 또는 첫 번째 단어
            const matchingWord = wordIds.find(id => {
                const word = getWordInfo(id);
                return word && word.direction === currentDirection;
            });
            const wordIdToSelect = matchingWord || wordIds[0];
            setSelectedWordId(wordIdToSelect);

            const word = getWordInfo(wordIdToSelect);
            if (word) {
                setCurrentDirection(word.direction);
            }
        }
    }, [currentDirection, getWordInfo]);

    // 힌트 클릭 처리 - 해당 단어의 첫 번째 미완성 셀로 이동
    const handleHintClick = useCallback((wordId, direction) => {
        const word = getWordInfo(wordId);
        if (!word) return;

        setSelectedWordId(wordId);
        setCurrentDirection(direction);

        // 해당 단어의 첫 번째 미완성 셀 찾기
        for (let i = 0; i < word.text.length; i++) {
            const row = word.direction === 'down' ? word.row + i : word.row;
            const col = word.direction === 'across' ? word.col + i : word.col;
            const cellKey = `${row}-${col}`;

            if (!completedCells.has(cellKey)) {
                setActiveCell({ row, col });
                return;
            }
        }

        // 모든 셀이 완료되었으면 첫 번째 셀로 이동
        setActiveCell({ row: word.row, col: word.col });
    }, [getWordInfo, completedCells]);

    // 퍼즐 완료 여부
    const isPuzzleComplete = useMemo(() => {
        return completedCells.size === totalCells && totalCells > 0;
    }, [completedCells.size, totalCells]);

    // 진행률
    const progress = useMemo(() => {
        if (totalCells === 0) return 0;
        return Math.round((completedCells.size / totalCells) * 100);
    }, [completedCells.size, totalCells]);

    // 리셋
    const resetPuzzle = useCallback(() => {
        setUserInputs({});
        setCompletedCells(new Set());
        setCompletedWords(new Set());
        setActiveCell(null);
        setSelectedWordId(null);
        setCurrentDirection('across');
        setWrongAttempts({});
        setExtraHintShown({});
    }, []);

    // 추가 힌트 토글
    const toggleExtraHint = useCallback((wordId) => {
        setExtraHintShown(prev => ({
            ...prev,
            [wordId]: !prev[wordId]
        }));
    }, []);

    // 첫 번째 입력 가능한 셀 찾기
    const findFirstInputCell = useCallback(() => {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (!grid[row][col].blocked) {
                    return { row, col };
                }
            }
        }
        return null;
    }, [grid]);

    // 초기 활성 셀 설정
    useEffect(() => {
        const firstCell = findFirstInputCell();
        if (firstCell && !activeCell) {
            setActiveCell(firstCell);
            // 첫 번째 셀의 단어 선택
            const cell = grid[firstCell.row]?.[firstCell.col];
            if (cell?.wordIds?.length > 0) {
                setSelectedWordId(cell.wordIds[0]);
            }
        }
    }, [findFirstInputCell, activeCell, grid]);

    return {
        stageData,
        grid,
        hints,
        userInputs,
        completedCells,
        completedWords,
        activeCell,
        setActiveCell,
        selectedWordId,
        setSelectedWordId,
        currentDirection,
        setCurrentDirection,
        totalCells,
        progress,
        isPuzzleComplete,
        handleCellInput,
        handleCellFocus,
        handleHintClick,
        checkAnswer,
        resetPuzzle,
        moveToNextCell,
        wrongAttempts,
        extraHintShown,
        toggleExtraHint,
    };
};

export default usePuzzle;
