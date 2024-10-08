export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","svelte.svg","tauri.svg","vite.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.DtHr_lE1.js","app":"_app/immutable/entry/app.CskaGDwq.js","imports":["_app/immutable/entry/start.DtHr_lE1.js","_app/immutable/chunks/entry.HE_Nldla.js","_app/immutable/chunks/scheduler.DirwnR-Z.js","_app/immutable/chunks/index.BHpgQ8v2.js","_app/immutable/chunks/environment.CZLhA_4V.js","_app/immutable/entry/app.CskaGDwq.js","_app/immutable/chunks/scheduler.DirwnR-Z.js","_app/immutable/chunks/index.VmO1ZtvU.js","_app/immutable/chunks/environment.CZLhA_4V.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
