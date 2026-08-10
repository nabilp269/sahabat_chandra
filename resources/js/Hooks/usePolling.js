import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

/**
 * Polling hook that auto-pauses during Inertia page navigation.
 * This prevents the single-threaded php artisan serve from blocking
 * navigation requests behind polling requests.
 *
 * @param {string[]} only - Props to reload
 * @param {number} interval - Polling interval in ms (default 5000)
 */
export default function usePolling(only = [], interval = 5000) {
    const timerRef = useRef(null);
    const pausedRef = useRef(false);

    useEffect(() => {
        const startPolling = () => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                if (!pausedRef.current) {
                    router.reload({
                        only,
                        preserveState: true,
                        preserveScroll: true,
                    });
                }
            }, interval);
        };

        // Pause polling when Inertia starts any navigation
        const removeStart = router.on("before", () => {
            pausedRef.current = true;
        });

        // Resume polling after navigation finishes (success or error)
        const removeFinish = router.on("finish", () => {
            pausedRef.current = false;
        });

        startPolling();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            removeStart();
            removeFinish();
        };
    }, []);
}
