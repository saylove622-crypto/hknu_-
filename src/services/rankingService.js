import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getRanking as getLocalRanking, addToRanking as addToLocalRanking } from '../utils/storage';

/**
 * Supabase에서 랭킹 가져오기
 */
export const fetchRanking = async (stage = 1, limit = 10) => {
    // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
    if (!isSupabaseConfigured()) {
        return {
            data: getLocalRanking(stage),
            error: null,
            isLocal: true
        };
    }

    try {
        const { data, error } = await supabase
            .from('rankings')
            .select('*')
            .eq('stage', stage)
            .order('time', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('Supabase 랭킹 조회 오류:', error);
            // 오류 시 로컬 스토리지 폴백
            return {
                data: getLocalRanking(stage),
                error,
                isLocal: true
            };
        }

        return {
            data: data || [],
            error: null,
            isLocal: false
        };
    } catch (err) {
        console.error('랭킹 조회 중 오류:', err);
        return {
            data: getLocalRanking(stage),
            error: err,
            isLocal: true
        };
    }
};

/**
 * Supabase에 랭킹 추가하기
 */
export const submitRanking = async (stage, nickname, time) => {
    // 로컬 스토리지에도 저장 (백업)
    const localRank = addToLocalRanking(stage, nickname, time);

    // Supabase가 설정되지 않은 경우 로컬 결과만 반환
    if (!isSupabaseConfigured()) {
        return {
            success: true,
            rank: localRank,
            isLocal: true,
            error: null
        };
    }

    try {
        // Supabase에 기록 저장
        const { data, error } = await supabase
            .from('rankings')
            .insert([
                {
                    stage,
                    nickname,
                    time,
                }
            ])
            .select();

        if (error) {
            console.error('Supabase 랭킹 저장 오류:', error);
            return {
                success: true,
                rank: localRank,
                isLocal: true,
                error
            };
        }

        // 현재 순위 가져오기
        const { data: rankData } = await supabase
            .from('rankings')
            .select('*')
            .eq('stage', stage)
            .order('time', { ascending: true })
            .limit(10);

        const rank = rankData?.findIndex(r => r.id === data[0]?.id) + 1;

        return {
            success: true,
            rank: rank > 0 && rank <= 10 ? rank : null,
            isLocal: false,
            error: null
        };
    } catch (err) {
        console.error('랭킹 저장 중 오류:', err);
        return {
            success: true,
            rank: localRank,
            isLocal: true,
            error: err
        };
    }
};

/**
 * 전체 랭킹 수 가져오기
 */
export const getTotalRankingCount = async (stage = 1) => {
    if (!isSupabaseConfigured()) {
        return getLocalRanking(stage).length;
    }

    try {
        const { count, error } = await supabase
            .from('rankings')
            .select('*', { count: 'exact', head: true })
            .eq('stage', stage);

        if (error) {
            return getLocalRanking(stage).length;
        }

        return count || 0;
    } catch (err) {
        return getLocalRanking(stage).length;
    }
};
