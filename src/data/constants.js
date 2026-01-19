// 게임 설정
export const GAME_CONFIG = {
  TOTAL_STAGES: 2,  // Stage 1 + Stage 2
  ANIMATION_DURATION: {
    FEEDBACK: 200,      // 정답/오답 피드백 (ms)
    CLEAR_ZOOM: 600,    // CLEAR 확대 (ms)
  },
};

// 랭킹 설정
export const RANKING_CONFIG = {
  MAX_DISPLAY: 5,
  NICKNAME_MAX_LENGTH: 10,
};

// 로컬스토리지 키
export const STORAGE_KEYS = {
  GAME_STATE: 'hknu_puzzle_game_state',
  RANKING: 'hknu_puzzle_ranking',
  BEST_TIME: 'hknu_puzzle_best_time',
};

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  CLEAR: '/clear',
  RANKING: '/ranking',
};
