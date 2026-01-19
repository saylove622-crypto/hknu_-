/**
 * 밀리초를 MM:SS 형식으로 변환
 * @param {number} ms - 밀리초
 * @returns {string} - 포맷된 시간 문자열
 */
export const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 밀리초를 MM:SS.ms 형식으로 변환 (상세)
 * @param {number} ms - 밀리초
 * @returns {string} - 포맷된 시간 문자열
 */
export const formatTimeDetailed = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

/**
 * MM:SS 형식을 밀리초로 변환
 * @param {string} timeString - 시간 문자열
 * @returns {number} - 밀리초
 */
export const parseTime = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
};
