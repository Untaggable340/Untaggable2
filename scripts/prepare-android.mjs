import{mkdir,copyFile,cp,rm,readFile,writeFile}from'node:fs/promises';
await rm('www',{recursive:true,force:true});
await mkdir('www/src',{recursive:true});
await mkdir('www/vendor',{recursive:true});
for(const f of['index.html','styles.css'])await copyFile(f,'www/'+f);
await cp('src','www/src',{recursive:true});

// Capacitor serves bundled files from https://localhost. Some Android WebViews
// fail dynamic ES-module imports from that virtual origin. Inline Three.js into
// the entry document for the APK so startup has no module fetch at all.
const three=await readFile('node_modules/three/build/three.module.min.js','utf8');
let html=await readFile('www/index.html','utf8');
const dynamicImport='const THREE=await import("./vendor/three.module.min.js");';
if(!html.includes(dynamicImport))throw new Error('Expected Three.js dynamic import was not found');
html=html.replace(dynamicImport,three+'\n const THREE={'+Array.from(three.matchAll(/export\{([^}]*)\}/g)).slice(-1)[0][1].split(',').map(x=>{const p=x.trim().split(/\s+as\s+/);return (p[1]||p[0])+':'+p[0]}).join(',')+'};');
await writeFile('www/index.html',html);
console.log('Prepared Android assets with Three.js embedded for fully offline startup.');
