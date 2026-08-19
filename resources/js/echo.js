import Echo from "laravel-echo";
import Pusher from "pusher-js";

/*
|--------------------------------------------------------------------------
| Pusher
|--------------------------------------------------------------------------
*/

window.Pusher = Pusher;

/*
|--------------------------------------------------------------------------
| Environment
|--------------------------------------------------------------------------
*/

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

const reverbHost =
    import.meta.env.VITE_REVERB_HOST ||
    window.location.hostname;

const reverbPort = Number(
    import.meta.env.VITE_REVERB_PORT || 8080
);

const reverbScheme =
    import.meta.env.VITE_REVERB_SCHEME || "http";

const forceTLS = reverbScheme === "https";

/*
|--------------------------------------------------------------------------
| Echo
|--------------------------------------------------------------------------
*/

const echo = new Echo({
    broadcaster: "reverb",

    key: reverbKey,

    wsHost: reverbHost,

    wsPort: reverbPort,

    wssPort: reverbPort,

    forceTLS: forceTLS,

    enabledTransports: forceTLS
        ? ["wss"]
        : ["ws", "wss"],

    /*
    |--------------------------------------------------------------------------
    | Reconnect
    |--------------------------------------------------------------------------
    */

    disableStats: true,
});

/*
|--------------------------------------------------------------------------
| Global Echo
|--------------------------------------------------------------------------
*/

window.Echo = echo;

/*
|--------------------------------------------------------------------------
| Debug
|--------------------------------------------------------------------------
|
| Bisa kita lihat di Console browser apakah Echo sudah dibuat.
|
*/

if (import.meta.env.DEV) {
    console.log("=================================");
    console.log("Laravel Echo initialized");
    console.log("Reverb host :", reverbHost);
    console.log("Reverb port :", reverbPort);
    console.log("Reverb scheme :", reverbScheme);
    console.log("Reverb key :", reverbKey);
    console.log("=================================");
}

export default echo;