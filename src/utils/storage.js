import { STORAGE_KEYS, RANKING_CONFIG } from '../data/constants';

/**
 * 로컬스토리지에서 값 가져오기
 */
export const getStorageItem = (key, defaultValue = null) => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * 로컬스토리지에 값 저장하기
 */
export const setStorageItem = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * 로컬스토리지에서 값 삭제하기
 */
export const removeStorageItem = (key) => {
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * 랭킹 데이터 가져오기
 */
export const getRanking = (stage = 1) => {
    const ranking = getStorageItem(STORAGE_KEYS.RANKING, {});
    return ranking[`stage${stage}`] || [];
};

/**
 * 랭킹에 기록 추가하기
 */
export const addToRanking = (stage, nickname, time) => {
    const ranking = getStorageItem(STORAGE_KEYS.RANKING, {});
    const stageKey = `stage${stage}`;

    if (!ranking[stageKey]) {
        ranking[stageKey] = [];
    }

    // 새 기록 추가
    ranking[stageKey].push({
        nickname,
        time,
        date: new Date().toISOString(),
    });

    // 시간순 정렬 (빠른 순)
    ranking[stageKey].sort((a, b) => a.time - b.time);

    // 상위 N개만 유지
    ranking[stageKey] = ranking[stageKey].slice(0, RANKING_CONFIG.MAX_DISPLAY);

    setStorageItem(STORAGE_KEYS.RANKING, ranking);

    // 순위 반환 (1-based)
    const rank = ranking[stageKey].findIndex(
        r => r.nickname === nickname && r.time === time
    ) + 1;

    return rank > 0 && rank <= RANKING_CONFIG.MAX_DISPLAY ? rank : null;
};

/**
 * 최고 기록 가져오기
 */
export const getBestTime = (stage = 1) => {
    const bestTimes = getStorageItem(STORAGE_KEYS.BEST_TIME, {});
    return bestTimes[`stage${stage}`] || null;
};

/**
 * 최고 기록 저장하기
 */
export const saveBestTime = (stage, time) => {
    const bestTimes = getStorageItem(STORAGE_KEYS.BEST_TIME, {});
    const stageKey = `stage${stage}`;

    if (!bestTimes[stageKey] || time < bestTimes[stageKey]) {
        bestTimes[stageKey] = time;
        setStorageItem(STORAGE_KEYS.BEST_TIME, bestTimes);
        return true; // 갱신됨
    }

    return false; // 갱신 안됨
};
