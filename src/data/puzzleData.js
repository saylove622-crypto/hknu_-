/**
 * 퍼즐 데이터 - 단어 정보만 정의
 * 그리드는 generateGrid 유틸로 자동 생성
 */

export const puzzleStages = {
    // ================================
    // Stage 1: 입문
    // ================================
    1: {
        id: 1,
        title: '한경국립대 기초',
        difficulty: 'easy',
        gridSize: { rows: 7, cols: 7 },

        words: [
            {
                id: 'w1',
                text: '백호',
                direction: 'across',
                row: 0,
                col: 0,
                hint: '한경국립대학교의 상징 동물, 흰 호랑이'
            },
            {
                id: 'w2',
                text: '안성',
                direction: 'across',
                row: 0,
                col: 4,
                hint: '한경국립대 안성캠퍼스 소재 도시'
            },
            {
                id: 'w3',
                text: '포도',
                direction: 'across',
                row: 3,
                col: 0,
                hint: '안성 5대 특산물 중 하나, 보라색 과일'
            },
            {
                id: 'w4',
                text: '국립대',
                direction: 'across',
                row: 3,
                col: 4,
                hint: '국가가 설립한 대학교 유형'
            },
            {
                id: 'w5',
                text: '은행',
                direction: 'down',
                row: 5,
                col: 1,
                hint: '한경국립대학교의 교목(校木), 노란 잎이 특징인 나무'
            },
        ],
    },

    // ================================
    // Stage 2: 심화 (v1.1에서 구현)
    // ================================
    2: {
        id: 2,
        title: '한경국립대 & 안성 심화',
        difficulty: 'hard',
        gridSize: { rows: 6, cols: 6 },

        words: [
            {
                id: 'w1',
                text: '한경이',
                direction: 'across',
                row: 0,
                col: 0,
                hint: '백호를 모티브로 한 한경국립대 공식 마스코트'
            },
            {
                id: 'w2',
                text: '평택',
                direction: 'across',
                row: 0,
                col: 4,
                hint: '한경국립대 제2캠퍼스 소재 도시'
            },
            {
                id: 'w3',
                text: '바우덕이',
                direction: 'across',
                row: 2,
                col: 0,
                hint: '안성 출신, 조선 후기 남사당패의 여성 꼭두쇠'
            },
            {
                id: 'w4',
                text: '안성맞춤',
                direction: 'across',
                row: 4,
                col: 0,
                hint: '"딱 맞다"는 의미, 안성 유기(鍮器)에서 유래'
            },
            {
                id: 'w5',
                text: '남사당',
                direction: 'down',
                row: 2,
                col: 5,
                hint: '조선시대 유랑 예인 집단, 안성이 발상지'
            },
        ],
    },
};

// 스테이지 정보 가져오기
export const getStageData = (stageNumber) => {
    return puzzleStages[stageNumber] || null;
};

// 전체 스테이지 수
export const TOTAL_STAGES = Object.keys(puzzleStages).length;
