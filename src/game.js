const c=document.querySelector('#c'),x=c.getContext('2d');let W,H,dpr;
const P={x:0,z:0,y:0,vy:0,stamina:100,sprint:false,slide:false},B={x:7,z:-6,speed:7.78};
let joy={x:0,y:0},last=performance.now(),time=60,over=false;
const role=document.querySelector('#role'),timer=document.querySelector('#timer'),fill=document.querySelector('#staminaFill'),msg=document.querySelector('#message');
const blocks=[[-5,-5,5,2],[5,3,4,2],[-1,9,6,2],[10,-7,3,3],[-11,5,3,4],[1,-10,5,2]];
function resize(){dpr=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);resize();
const pad=document.querySelector('#leftPad'),stick=document.querySelector('#stick');
function joyAt(e){let r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy)||1,k=Math.min(1,52/m);joy={x:dx/m*k,y:dy/m*k};stick.style.transform=`translate(${joy.x*38}px,${joy.y*38}px)`}
pad.onpointerdown=e=>{pad.setPointerCapture(e.pointerId);joyAt(e)};pad.onpointermove=e=>{if(pad.hasPointerCapture(e.pointerId))joyAt(e)};pad.onpointerup=pad.onpointercancel=()=>{joy={x:0,y:0};stick.style.transform=''};
function hold(id,key){let b=document.querySelector(id);b.onpointerdown=e=>{e.preventDefault();P[key]=true;b.classList.add('active');b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=()=>{P[key]=false;b.classList.remove('active')}}hold('#sprint','sprint');hold('#slide','slide');
document.querySelector('#jump').onpointerdown=e=>{e.currentTarget.classList.add('active');if(P.y<=.01){let t=P.stamina/100;P.vy=5.75+(6.7-5.75)*t;P.stamina=Math.max(0,P.stamina-18)}};document.querySelector('#jump').onpointerup=e=>e.currentTarget.classList.remove('active');
document.querySelector('#parkour').onpointerdown=e=>{e.currentTarget.classList.add('active');if(P.y<.7){P.vy=Math.max(P.vy,4.7);P.stamina=Math.max(0,P.stamina-10)}};document.querySelector('#parkour').onpointerup=e=>e.currentTarget.classList.remove('active');
addEventListener('keydown',e=>{if(e.key==='Shift')P.sprint=true;if(e.code==='Space'&&P.y<=.01){P.vy=P.stamina?6.7:5.75;P.stamina=Math.max(0,P.stamina-18)}if(e.key==='w')joy.y=-1;if(e.key==='s')joy.y=1;if(e.key==='a')joy.x=-1;if(e.key==='d')joy.x=1});addEventListener('keyup',e=>{if(e.key==='Shift')P.sprint=false;if('wasd'.includes(e.key))joy={x:0,y:0}});
function update(dt){if(over)return;time-=dt;if(time<=0){time=0;over=true;flash('YOU ESCAPED');return}let m=Math.min(1,Math.hypot(joy.x,joy.y)),speed=4.8;if(P.sprint&&P.stamina>0&&m){speed=7.4;P.stamina=Math.max(0,P.stamina-22*dt)}else P.stamina=Math.min(100,P.stamina+17*dt);if(P.slide&&m)speed*=1.08;P.x+=joy.x*speed*dt;P.z+=joy.y*speed*dt;P.vy-=13.5*dt;P.y=Math.max(0,P.y+P.vy*dt);if(P.y===0&&P.vy<0)P.vy=0;
let dx=P.x-B.x,dz=P.z-B.z,d=Math.hypot(dx,dz)||1;B.x+=dx/d*B.speed*dt;B.z+=dz/d*B.speed*dt;if(d<.75){over=true;role.textContent='TAGGED';flash('TAGGED!')}}
function flash(t){msg.textContent=t;msg.classList.add('show')}
function proj(wx,wz,wy=0){let s=Math.min(W,H)/28;return [W/2+(wx-P.x)*s,H/2+(wz-P.z)*s-wy*s]}
function draw(){x.clearRect(0,0,W,H);let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#182633');g.addColorStop(1,'#0a1015');x.fillStyle=g;x.fillRect(0,0,W,H);let s=Math.min(W,H)/28;
x.strokeStyle='#ffffff0c';x.lineWidth=1;for(let i=-30;i<=30;i++){let a=proj(i,-30),b=proj(i,30);x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke();a=proj(-30,i);b=proj(30,i);x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke()}
for(const [bx,bz,bw,bh] of blocks){let q=proj(bx,bz);x.fillStyle='#293946';x.fillRect(q[0]-bw*s/2,q[1]-bh*s/2,bw*s,bh*s);x.strokeStyle='#ffffff22';x.strokeRect(q[0]-bw*s/2,q[1]-bh*s/2,bw*s,bh*s)}
let bp=proj(B.x,B.z);x.fillStyle='#ff6b55';x.beginPath();x.arc(bp[0],bp[1],11,0,7);x.fill();x.fillStyle='#fff';x.font='bold 9px Arial';x.textAlign='center';x.fillText('TAGGER',bp[0],bp[1]-16);
let pp=proj(P.x,P.z,P.y);x.fillStyle='#64c9ff';x.beginPath();x.arc(pp[0],pp[1],12,0,7);x.fill();x.fillStyle='#ffffff55';x.beginPath();x.ellipse(W/2,H/2+5,13,6,0,0,7);x.fill();timer.textContent=Math.ceil(time);fill.style.width=P.stamina+'%';fill.classList.toggle('low',P.stamina<25)}
function loop(t){let dt=Math.min(.033,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);