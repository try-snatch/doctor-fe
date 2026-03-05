import React, { useRef, useState, useEffect } from 'react';

const THRESHOLD = 55;   // indicator height (px) at which refresh fires
const MAX_PULL = 68;    // max indicator height during drag

const PullToRefresh = ({ onRefresh, children }) => {
    const [indicatorHeight, setIndicatorHeight] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [pulling, setPulling] = useState(false);

    const startYRef = useRef(null);
    const currentPullRef = useRef(0);
    const isPullingRef = useRef(false);
    const isRefreshingRef = useRef(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const getScrollTop = () => {
            const root = document.getElementById('root');
            return root ? root.scrollTop : window.scrollY;
        };

        const onTouchStart = (e) => {
            if (isRefreshingRef.current) return;
            if (getScrollTop() > 2) return;
            startYRef.current = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            if (isRefreshingRef.current || startYRef.current === null) return;
            const delta = e.touches[0].clientY - startYRef.current;
            if (delta <= 0 || getScrollTop() > 2) {
                if (!isPullingRef.current) {
                    startYRef.current = null;
                }
                return;
            }
            e.preventDefault();
            if (!isPullingRef.current) {
                isPullingRef.current = true;
                setPulling(true);
            }
            const h = Math.min(delta * 0.5, MAX_PULL);
            currentPullRef.current = h;
            setIndicatorHeight(h);
        };

        const onTouchEnd = async () => {
            if (!isPullingRef.current || isRefreshingRef.current) {
                startYRef.current = null;
                isPullingRef.current = false;
                currentPullRef.current = 0;
                setPulling(false);
                setIndicatorHeight(0);
                return;
            }
            const pulled = currentPullRef.current;
            startYRef.current = null;
            isPullingRef.current = false;
            currentPullRef.current = 0;
            setPulling(false);

            if (pulled >= THRESHOLD) {
                isRefreshingRef.current = true;
                setRefreshing(true);
                setIndicatorHeight(48);
                try {
                    await onRefresh();
                } finally {
                    isRefreshingRef.current = false;
                    setRefreshing(false);
                    setIndicatorHeight(0);
                }
            } else {
                setIndicatorHeight(0);
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });
        el.addEventListener('touchcancel', onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
            el.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [onRefresh]);

    const showIndicator = indicatorHeight > 0 || refreshing;
    const progress = Math.min(indicatorHeight / THRESHOLD, 1);

    return (
        <div ref={containerRef}>
            <div
                className="flex items-center justify-center bg-gray-50 overflow-hidden"
                style={{
                    height: showIndicator ? `${indicatorHeight}px` : '0px',
                    transition: pulling ? 'none' : 'height 0.3s ease',
                }}
            >
                {showIndicator && (
                    <div
                        className={`w-6 h-6 rounded-full border-[2.5px] border-primary-500 border-t-transparent ${refreshing ? 'animate-spin' : ''}`}
                        style={!refreshing ? {
                            opacity: progress,
                            transform: `rotate(${progress * 270}deg)`,
                        } : undefined}
                    />
                )}
            </div>
            {children}
        </div>
    );
};

export default PullToRefresh;
