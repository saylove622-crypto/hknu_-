-- ========================================
-- Supabase 랭킹 테이블 설정
-- ========================================
-- Supabase 대시보드 > SQL Editor 에서 실행하세요

-- 1. 랭킹 테이블 생성
CREATE TABLE IF NOT EXISTS rankings (
    id SERIAL PRIMARY KEY,
    stage INTEGER NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_rankings_stage_time ON rankings(stage, time);

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- 4. 모든 사용자가 랭킹 조회 가능
CREATE POLICY "Anyone can read rankings" ON rankings
    FOR SELECT USING (true);

-- 5. 모든 사용자가 랭킹 등록 가능
CREATE POLICY "Anyone can insert rankings" ON rankings
    FOR INSERT WITH CHECK (true);

-- ========================================
-- 테스트 데이터 (선택사항)
-- ========================================
-- INSERT INTO rankings (stage, nickname, time) VALUES
--     (1, '테스터1', 45000),
--     (1, '테스터2', 52000),
--     (1, '테스터3', 61000);
