import React from 'react';
import { formatTime } from '../../utils/formatTime';
import './Timer.scss';

const Timer = ({ time, isRunning, size = 'medium' }) => {
    const timerClasses = [
        'timer',
        `timer--${size}`,
        isRunning && 'timer--running',
    ].filter(Boolean).join(' ');

    return (
        <div className={timerClasses}>
            <span className="timer__icon">⏱️</span>
            <span className="timer__value">{formatTime(time)}</span>
        </div>
    );
};

export default Timer;
