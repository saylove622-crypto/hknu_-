import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../data/constants';
import './NotFoundPage.scss';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-page__content">
                <span className="not-found-page__emoji">🐯❓</span>
                <h1 className="not-found-page__title">404</h1>
                <p className="not-found-page__message">
                    앗! 페이지를 찾을 수 없습니다.
                </p>
                <p className="not-found-page__submessage">
                    길을 잃으셨나요? 메인으로 돌아가세요!
                </p>
                <Link to={ROUTES.HOME}>
                    <Button variant="primary" size="large">
                        🏠 메인으로
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
