import { useEffect } from "react";

/**
 * Subscribe to a private Echo channel and listen for an event.
 * Automatically unsubscribes on unmount.
 *
 * @param {string} channel  - Channel name without "private-" prefix, e.g. "user.1"
 * @param {string} event    - Event class name, e.g. ".TransactionStatusUpdated"
 * @param {function} callback
 */
export default function useEcho(channel, event, callback) {
    useEffect(() => {
        if (!window.Echo) return;

        const ch = window.Echo.private(channel);
        ch.listen(event, callback);

        return () => {
            ch.stopListening(event, callback);
            window.Echo.leave("private-" + channel);
        };
    }, [channel, event]);
}
