import fs from 'node:fs';
const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY','NEXT_PUBLIC_DEFAULT_CLUB_SLUG','MUX_TOKEN_ID','MUX_TOKEN_SECRET','MUX_WEBHOOK_SIGNING_SECRET','NEXT_PUBLIC_APP_URL'];
let env={};
for(const file of ['.env.local','.env']) if(fs.existsSync(file)){for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){if(!line||line.startsWith('#')||!line.includes('='))continue;const i=line.indexOf('=');env[line.slice(0,i).trim()]=line.slice(i+1).trim();}}
let missing=required.filter(k=>!env[k]);
console.log('Club Deportivo · Preflight');
console.log('Node:',process.version);
console.log('Modo demo:',env.NEXT_PUBLIC_DEMO_MODE ?? '(no definido)');
if(missing.length){console.error('\nFaltan variables de producción:\n- '+missing.join('\n- '));process.exitCode=1;}else console.log('\n✓ Variables principales configuradas.');
if(env.NEXT_PUBLIC_DEMO_MODE!=='false'){console.error('⚠ NEXT_PUBLIC_DEMO_MODE debe ser false antes de vender/publicar.');process.exitCode=1;}
