import axios from "axios";

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] =
    "XMLHttpRequest";

/*
|--------------------------------------------------------------------------
| Laravel Echo / Reverb
|--------------------------------------------------------------------------
|
| Echo diinisialisasi dari resources/js/echo.js
|
*/

import "./echo";