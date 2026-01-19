/**
 * 단어 목록으로부터 퍼즐 그리드 자동 생성
 */
export const generateGrid = (stageData) => {
    const { gridSize, words } = stageData;
    const { rows, cols } = gridSize;

    // 빈 그리드 초기화
    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            answer: null,
            blocked: true,
            wordIds: [],
            isIntersection: false,
        }))
    );

    // 단어 배치
    words.forEach((word) => {
        const { id, text, direction, row: startRow, col: startCol } = word;

        for (let i = 0; i < text.length; i++) {
            const row = direction === 'down' ? startRow + i : startRow;
            const col = direction === 'across' ? startCol + i : startCol;

            // 범위 체크
            if (row >= rows || col >= cols) {
                console.warn(`Word "${text}" exceeds grid bounds at (${row}, ${col})`);
                continue;
            }

            const cell = grid[row][col];

            // 교차점 체크 (이미 글자가 있는 경우)
            if (cell.answer !== null) {
                if (cell.answer !== text[i]) {
                    console.error(`Conflict at (${row}, ${col}): "${cell.answer}" vs "${text[i]}"`);
                }
                cell.isIntersection = true;
                cell.wordIds.push(id);
            } else {
                cell.answer = text[i];
                cell.blocked = false;
                cell.wordIds = [id];
            }
        }
    });

    return grid;
};

/**
 * 힌트 목록 생성
 */
export const generateHints = (words) => {
    const across = [];
    const down = [];

    let acrossNum = 1;
    let downNum = 1;

    words.forEach((word) => {
        const hintObj = {
            wordId: word.id,
            hint: word.hint,
            length: word.text.length,
        };

        if (word.direction === 'across') {
            hintObj.number = acrossNum++;
            across.push(hintObj);
        } else {
            hintObj.number = downNum++;
            down.push(hintObj);
        }
    });

    return { across, down };
};

/**
 * 셀의 입력 가능한 셀만 필터링하여 반환
 */
export const getInputCells = (grid) => {
    const cells = [];

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (!cell.blocked) {
                cells.push({
                    row: rowIndex,
                    col: colIndex,
                    ...cell,
                });
            }
        });
    });

    return cells;
};

/**
 * 총 입력해야 할 셀 수 계산
 */
export const getTotalCellCount = (grid) => {
    return grid.flat().filter(cell => !cell.blocked).length;
};
