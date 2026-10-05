import{mkdir,copyFile,cp,rm,readFile,writeFile}from'node:fs/promises';
await rm('www',{recursive:true,force:true});
await mkdir('www/src',{recursive:true});
await mkdir('www/vendor',{recursive:true});
for(const f of['index.html','styles.css'])await copyFile(f,'www/'+f);
await cp('src','www/src',{recursive:true});

// Build a single offline module for Android. Three's final ES-module export
// statement cannot legally live inside the game's async function, so strip it
// before inlining and recreate the THREE namespace from the same export list.
const three=await readFile('node_modules/three/build/three.module.min.js','utf8');
let html=await readFile('www/index.html','utf8');
const dynamicImport='const THREE=await import("./vendor/three.module.min.js");';
if(!html.includes(dynamicImport))throw new Error('Expected Three.js dynamic import was not found');
const matches=[...three.matchAll(/export\{([^}]*)\};?/g)];
const exp=matches.at(-1);
if(!exp)throw new Error('Three.js export list was not found');
const exportList=exp[1];
const threeBody=three.slice(0,exp.index)+three.slice(exp.index+exp[0].length);
const namespace=exportList.split(',').map(x=>{const p=x.trim().split(/\s+as\s+/);return (p[1]||p[0])+':'+p[0]}).join(',');
html=html.replace(dynamicImport,threeBody+'\n const THREE={'+namespace+'};');

// A classic-script watchdog still runs if the module has a parse/startup failure.
const watchdog=`<script>
window.__untaggableBooted=false;
window.addEventListener('error',function(e){var l=document.getElementById('loading'),x=document.getElementById('error');if(l)l.style.display='none';if(x){x.textContent='STARTUP ERROR: '+(e.message||'Unknown JavaScript error');x.style.display='flex';}});
window.addEventListener('unhandledrejection',function(e){var l=document.getElementById('loading'),x=document.getElementById('error');if(l)l.style.display='none';if(x){var r=e.reason;x.textContent='STARTUP ERROR: '+(r&&r.message?r.message:String(r||'Unhandled promise rejection'));x.style.display='flex';}});
setTimeout(function(){if(!window.__untaggableBooted){var l=document.getElementById('loading'),x=document.getElementById('error');if(l)l.style.display='none';if(x){x.textContent='STARTUP ERROR: initialization timed out';x.style.display='flex';}}},12000);
</script>`;
html=html.replace('<script type="module">',watchdog+'\n<script type="module">');
html=html.replace("}requestAnimationFrame(loop);document.getElementById('loading').style.display='none';","}requestAnimationFrame(loop);window.__untaggableBooted=true;document.getElementById('loading').style.display='none';");
await writeFile('www/index.html',html);
console.log('Prepared Android assets with valid inlined Three.js and startup diagnostics.');
