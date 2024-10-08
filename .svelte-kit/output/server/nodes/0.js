import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Cgh9GSSH.js","_app/immutable/chunks/scheduler.DirwnR-Z.js","_app/immutable/chunks/index.VmO1ZtvU.js","_app/immutable/chunks/utils.CO-ccwgz.js","_app/immutable/chunks/index.BHpgQ8v2.js"];
export const stylesheets = ["_app/immutable/assets/0.CobzZa0y.css"];
export const fonts = [];
