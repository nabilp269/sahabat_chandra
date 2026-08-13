import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Initialize Echo (Reverb) client if available. Requires `npm install laravel-echo pusher-js`.
try {
	import('./echo');
} catch (e) {
	// ignore if import fails (no JS dependencies installed yet)
}
    