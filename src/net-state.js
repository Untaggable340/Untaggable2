// Untaggable shared match-state contract.
// Offline simulation and future online transport should exchange this shape.
export const PROTOCOL_VERSION=1;
export function makePlayer(id,name,character){return{id,name,character,x:0,y:0,z:0,vy:0,stamina:100,infected:false,connected:true}}
export function makeMatch({mode='normal',arena='training',duration=60}={}){return{protocol:PROTOCOL_VERSION,mode,arena,duration,remaining:duration,status:'lobby',players:{},tick:0}}
export function snapshot(match){return{protocol:match.protocol,mode:match.mode,arena:match.arena,remaining:match.remaining,status:match.status,tick:match.tick,players:Object.values(match.players).map(p=>({id:p.id,name:p.name,character:p.character,x:p.x,y:p.y,z:p.z,stamina:p.stamina,infected:p.infected,connected:p.connected}))}}
export function applySnapshot(match,data){if(!data||data.protocol!==PROTOCOL_VERSION)return false;match.mode=data.mode;match.arena=data.arena;match.remaining=data.remaining;match.status=data.status;match.tick=data.tick;for(const p of data.players||[])match.players[p.id]={...(match.players[p.id]||{}),...p};return true}
