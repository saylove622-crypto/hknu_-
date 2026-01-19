import React, { useCallback } from 'react';
import PuzzleCell from './PuzzleCell';
import './PuzzleGrid.scss';

const PuzzleGrid = ({
    grid,
    userInputs,
    completedCells,
    activeCell,
    selectedWordId,
    onCellInput,
    onCellFocus,
    onCellKeyDown,
}) => {
    // 셀이 하이라이트되어야 하는지 체크
    const isCellHighlighted = useCallback((row, col, cell) => {
        if (!selectedWordId || !cell.wordIds) return false;
        return cell.wordIds.includes(selectedWordId);
    }, [selectedWordId]);

    // 키보드 네비게이션 처리
    const handleKeyDown = useCallback((e, row, col) => {
        let newRow = row;
        let newCol = col;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                newRow = Math.min(grid.length - 1, row + 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                newCol = Math.min(grid[0].length - 1, col + 1);
                break;
            case 'Tab':
                // 기본 Tab 동작 허용
                return;
            default:
                return;
        }

        // 블록된 셀 건너뛰기
        if (!grid[newRow][newCol].blocked) {
            if (onCellKeyDown) {
                onCellKeyDown(newRow, newCol);
            }
        }
    }, [grid, onCellKeyDown]);

    if (!grid || grid.length === 0) {
        return <div className="puzzle-grid puzzle-grid--empty">퍼즐을 불러오는 중...</div>;
    }

    return (
        <div className="puzzle-grid">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="puzzle-grid__row">
                    {row.map((cell, colIndex) => {
                        const cellKey = `${rowIndex}-${colIndex}`;
                        const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
                        const isCompleted = completedCells.has(cellKey);
                        const isHighlighted = isCellHighlighted(rowIndex, colIndex, cell);

                        return (
                            <PuzzleCell
                                key={cellKey}
                                row={rowIndex}
                                col={colIndex}
                                cellData={cell}
                                isActive={isActive}
                                isHighlighted={isHighlighted}
                                isCompleted={isCompleted}
                                userValue={userInputs[cellKey]}
                                onInput={onCellInput}
                                onFocus={onCellFocus}
                                onKeyDown={handleKeyDown}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PuzzleGrid;
