import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
const response=await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded',timeout:30000});
if(!response?.ok())throw new Error('HTTP startup failed: '+response?.status());
await page.waitForFunction(()=>window.__untaggableBooted===true,{timeout:20000});
const state=await page.evaluate(()=>({
  booted:window.__untaggableBooted,
  stage:window.__untaggableBootStage,
  loading:getComputedStyle(document.getElementById('loading')).display,
  error:getComputedStyle(document.getElementById('error')).display,
  menu:getComputedStyle(document.getElementById('menu')).display,
  canvas:!!document.querySelector('canvas')
}));
await browser.close();
if(errors.length)throw new Error(errors.join('\n'));
if(!state.booted||state.stage!=='ready'||state.loading!=='none'||state.error!=='none'||!state.canvas)throw new Error('Bad boot state: '+JSON.stringify(state));
console.log('Untaggable web boot smoke test passed:',state);
