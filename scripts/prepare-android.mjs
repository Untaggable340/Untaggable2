import{mkdir,copyFile,cp,rm,readFile,writeFile}from'node:fs/promises';
import{execFileSync}from'node:child_process';

await rm('www',{recursive:true,force:true});
await mkdir('www/src',{recursive:true});
await mkdir('www/vendor',{recursive:true});
for(const file of['index.html','styles.css'])await copyFile(file,'www/'+file);
await cp('src','www/src',{recursive:true});

// Keep Three.js as real ES modules. three.module.min.js imports three.core.min.js,
// so both files must be present in the offline Android bundle.
await copyFile('node_modules/three/build/three.module.min.js','www/vendor/three.module.min.js');
await copyFile('node_modules/three/build/three.core.min.js','www/vendor/three.core.min.js');

let html=await readFile('www/index.html','utf8');
const dynamicImport='const THREE=await import("./vendor/three.module.min.js");';
if(!html.includes(dynamicImport))throw new Error('Expected Three.js dynamic import was not found');

if(!html.includes('window.__untaggableBooted=false'))throw new Error('Web startup watchdog is missing');
if(!html.includes('window.__untaggableBooted=true'))throw new Error('Web boot completion marker is missing');

const moduleStart='<script type="module">';
const moduleStartAt=html.indexOf(moduleStart);
const moduleEndAt=moduleStartAt<0?-1:html.indexOf('</script>',moduleStartAt+moduleStart.length);
const packagedModule=moduleStartAt>=0&&moduleEndAt>moduleStartAt?html.slice(moduleStartAt+moduleStart.length,moduleEndAt):null;
if(!packagedModule)throw new Error('Packaged game module was not found');
if(!packagedModule.includes(dynamicImport))throw new Error('Packaged Three.js import was not preserved');
if(!html.includes('window.__untaggableBooted=true'))throw new Error('Startup watchdog completion marker was not injected');

const syntaxCheck='www/.untaggable-boot-check.mjs';
await writeFile(syntaxCheck,packagedModule);
try{execFileSync(process.execPath,['--check',syntaxCheck],{stdio:'pipe'});}
catch(err){const details=err.stderr?.toString()||err.stdout?.toString()||err.message;throw new Error('Packaged game module failed syntax validation:\n'+details);}
finally{await rm(syntaxCheck,{force:true});}

await writeFile('www/index.html',html);
console.log('Prepared Android assets with local Three.js modules and startup diagnostics.');
