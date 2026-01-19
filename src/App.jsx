import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Loading from './components/common/Loading';
import { ROUTES } from './data/constants';

// 페이지 컴포넌트
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import ClearPage from './pages/ClearPage';
import RankingPage from './pages/RankingPage';
import NotFoundPage from './pages/NotFoundPage';

// 스타일
import './styles/main.scss';
import './App.scss';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading message="페이지를 불러오는 중..." />}>
          <div className="app">
            <Routes>
              <Route path={ROUTES.HOME} element={<MainPage />} />
              <Route path={ROUTES.GAME} element={<GamePage />} />
              <Route path={ROUTES.CLEAR} element={<ClearPage />} />
              <Route path={ROUTES.RANKING} element={<RankingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
