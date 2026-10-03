/* Shared phase pages use only already published art and actual local saves. */
(() => {
  const base='/assets/themes/';
  const rooms=[
    ['Kat','Goblin Author Den','kat-den.webp'],['Gerald','Neon Archive','gerald-neon-archive.webp'],['Alex','Red Lantern Cinema','alex-cinema.webp'],['Dad','Evergreen Guildhall','dad-guildhall.webp'],['Ma / Janelle','Rosewood Conservatory','ma-conservatory.webp'],['Mama','Room','mama-room.webp'],['Memaw','Room','memaw-room.webp'],['Derek','Room','derek-room.webp'],['Spencer','Hero Launchpad','spencer-room.webp'],['Emmy','Room','emmy-room.webp'],['Hayley','Room','hayley-room.webp'],['Kat’s Corner','Classic Arcade','classic-characters.webp'],['Kat’s Corner','Classic Game Room','game-room.webp'],['Midnight Terminal','Room','midnight-room.webp'],['Fantasy Tavern','Room','fantasy-room.webp'],['Cozy Console Den','Room','cozy-room.webp'],['Crimson Moon Keep','Journey’s Room','journey-room.webp']
  ];
  const buddies=[
    ['Studio cat','Always in the frame','themes/alex-cat.webp'],['Whisper','Dad’s guild chair belongs to Whisper','themes/dad-whisper.webp'],['Garden rabbit','At Ma’s garden desk','themes/ma-rabbit.webp'],['Archive Bot','Gerald’s filing assistant','themes/gerald-archive-bot.webp'],['Phosphor Ghost','Midnight Terminal','buddies/midnight.webp'],['Inn Fox','Fantasy Tavern','buddies/fantasy.webp'],['Console Dust Bunny','Cozy Console Den','buddies/cozy.webp'],['Smokey','Memaw’s lavender hearth','buddies/memaw.webp'],['Bubblewood Badger','Derek’s cottage','buddies/derek.webp'],['Porch Hen','Mama’s porch','buddies/mama.webp'],['Honeybell Songbird','Hayley’s burrow','buddies/hayley.webp'],['Café Familiar','Emmy’s window booth','buddies/emmy.webp'],['Moon Keep Fox','Journey’s keep','buddies/journey.webp'],['Zap Rover','Spencer’s launchpad','buddies/spencer.webp']
  ];
  const card=(title,note,image,tag='')=>{const a=document.createElement('article');a.className='restoration-card';if(image){const img=document.createElement('img');img.src=image.includes('/')?'/assets/'+image:base+image;img.alt=title;img.loading='lazy';a.append(img)}if(tag){const small=document.createElement('small');small.textContent=tag;a.append(small)}const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=note;a.append(h,p);return a};
  document.getElementById('character-grid').append(...rooms.map(([name,room,image])=>card(name,room,image,'Room setting')));
  document.getElementById('character-grid').prepend(card('Kat’s avatar','The author who built the first version of this arcade','kat-mini-blue.webp','Avatar'));
  const roomIds=['kat','gerald','alex','dad','ma','mama','memaw','derek','spencer','emmy','hayley','classic','game-room','midnight','fantasy','cozy','journey'];
  document.querySelectorAll('#character-grid .restoration-card').forEach((tile,index)=>{
    if(index===0)return;
    const id=roomIds[index-1],button=document.createElement('button');button.type='button';button.className='room-preview-button';button.textContent='Preview this room';
    button.addEventListener('click',()=>{document.getElementById('theme-open').click();document.querySelector(`[data-preview-theme="${id}"]`)?.click()});tile.append(button);
  });
  const mascots=document.getElementById('mascot-grid'),buddyRooms=['alex','dad','ma','gerald','midnight','fantasy','cozy','memaw','derek','mama','hayley','emmy','journey','spencer'];
  mascots.append(...buddies.map(([name,note,image],index)=>{const tile=card(name,note,image,'Companion');tile.dataset.room=buddyRooms[index];return tile}));
  const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}};
  function refresh(){
    const adopted=read('kats-corner-monsters',[]);
    mascots.querySelectorAll('.saved-monster').forEach(node=>node.remove());
    const creatureIds=new Set(['ember','moonbun','mimic','spriglet','bubble','puffwyrm']);
    if(Array.isArray(adopted)) adopted.slice(-20).forEach(entry=>{const name=typeof entry==='string'?entry:entry?.name||entry?.species||'Tiny monster';const species=creatureIds.has(entry?.species)?`games/creature-${entry.species}.webp`:null;const c=card(String(name),'Adopted friend saved in this browser',species,'Your friend');c.classList.add('saved-monster');mascots.append(c)});
    const story=read('kats-corner-choose-your-fate-v1',{}),endings=story?.endings;
    const cottage=read('fae-fate-cottage',null),miscasts=read('kats-corner-spellbook-miscasts-v1',[]);
    const facts=[['Story endings',`${Array.isArray(endings)?endings.length:0} of 8 found`],['Story choices',`${Number(story?.decisions)||0} decisions saved`],['Adopted monsters',`${Array.isArray(adopted)?adopted.length:0} saved`],['Cozy Cottage',cottage&&typeof cottage==='object'?(cottage.name||'A cottage')+' saved':'No cottage saved yet'],['Goblin Gold Rush',String(read('kats-corner-goblin-best',0))+' best score'],['Potion Problems',String(read('kats-corner-potion-best',0))+' of 3 best shift'],['Spellbook',`${Array.isArray(miscasts)?miscasts.length:0} recent miscasts saved`]];
    const grid=document.getElementById('record-grid');grid.replaceChildren(...facts.map(([label,value])=>card(label,value,null,'Saved here')));
    const scores=document.getElementById('shelf-scores');scores.replaceChildren();
    for(const [label,value] of [['Goblin best',String(read('kats-corner-goblin-best',0))],['Potion best',String(read('kats-corner-potion-best',0))+' / 3'],['Story endings',`${Array.isArray(endings)?endings.length:0} / 8`]]){const cell=document.createElement('div'),strong=document.createElement('strong'),span=document.createElement('span');strong.textContent=value;span.textContent=label;cell.append(strong,span);scores.append(cell)}
    const achieved=[
      ['First ending',Array.isArray(endings)&&endings.length>=1,'Reach any Choose Your Fate ending'],
      ['All eight fates',Array.isArray(endings)&&endings.length>=8,'Find every story ending'],
      ['Little caretaker',Array.isArray(adopted)&&adopted.length>=1,'Adopt a tiny monster'],
      ['Full nursery',Array.isArray(adopted)&&adopted.length>=6,'Save six monster friends'],
      ['Housewarming',!!cottage&&typeof cottage==='object','Save a cozy cottage'],
      ['Pocket treasure',Number(read('kats-corner-goblin-best',0))>0,'Catch a coin in Goblin Gold Rush'],
      ['Remedy maker',Number(read('kats-corner-potion-best',0))>0,'Finish a Potion Problems shift with a remedy'],
      ['Helpful typo',Array.isArray(miscasts)&&miscasts.length>0,'Save a Spellbook miscast']
    ];
    const storyTitles={knight:'The Accidental Knight',mage:'The Curious Mage',rogue:'The Charming Rogue',healer:'The Reluctant Healer',necromancer:'The Polite Necromancer',dragon:'Dragon Friend',tavern:'The Tavern Owner',hidden:'Keeper of the Unwritten Door'};
    for(const [id,title] of Object.entries(storyTitles))achieved.push([title,Array.isArray(endings)&&endings.includes(id),'Discover this story ending']);
    document.getElementById('achievement-grid').replaceChildren(...achieved.map(([name,earned,description])=>{const tile=card(name,description,null,earned?'Earned':'Locked');if(earned){const button=document.createElement('button');button.type='button';button.className='badge-share';button.textContent='Download badge card';tile.append(button)}else tile.classList.add('locked');return tile}));
  }
  addEventListener('hashchange',refresh);addEventListener('storage',refresh);refresh();
  const motion=document.getElementById('settings-motion');
  try{motion.checked=localStorage.getItem('kats-corner-reduce-motion')==='true'}catch{}
  const setMotion=()=>document.documentElement.dataset.katsReduceMotion=String(motion.checked);
  motion.addEventListener('change',()=>{setMotion();try{localStorage.setItem('kats-corner-reduce-motion',String(motion.checked))}catch{}});setMotion();
  document.getElementById('settings-themes').addEventListener('click',()=>document.getElementById('theme-open').click());
  const gameKeys=['kats-corner-choose-your-fate-v1','kats-corner-monsters','fae-fate-cottage','kats-corner-goblin-best','kats-corner-potion-best','kats-corner-spellbook-miscasts-v1'];
  const valid=(key,value)=>{
    if(key===gameKeys[0])return value&&typeof value==='object'&&!Array.isArray(value)&&Array.isArray(value.endings)&&value.endings.length<=8&&value.endings.every(x=>typeof x==='string'&&x.length<32)&&Number.isInteger(value.decisions)&&value.decisions>=0&&value.decisions<1e7&&typeof value.sound==='boolean';
    if(key===gameKeys[1])return Array.isArray(value)&&value.length<=20&&value.every(x=>x&&typeof x==='object'&&typeof x.name==='string'&&x.name.length<=24&&typeof x.species==='string'&&x.species.length<32);
    if(key===gameKeys[2])return value&&typeof value==='object'&&!Array.isArray(value)&&typeof value.name==='string'&&value.name.length<=40&&['walls','roof','sky','garden','friend'].every(x=>Number.isInteger(value[x])&&value[x]>=0&&value[x]<=2);
    if(key===gameKeys[3]||key===gameKeys[4])return Number.isInteger(value)&&value>=0&&value<1e7;
    if(key===gameKeys[5])return Array.isArray(value)&&value.length<=30&&value.every(x=>x&&typeof x==='object');
    return false;
  };
  const backupStatus=document.getElementById('save-import-preview'),confirm=document.getElementById('save-import-confirm');let pending=null;
  document.getElementById('save-export').addEventListener('click',()=>{
    const saves={};for(const key of gameKeys){const value=read(key,null);if(value!==null&&valid(key,value))saves[key]=value}
    const blob=new Blob([JSON.stringify({format:'kats-corner-saves',version:1,saves},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='kats-corner-game-saves.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.getElementById('save-import-file').addEventListener('change',async event=>{
    pending=null;confirm.disabled=true;const file=event.target.files?.[0];if(!file){backupStatus.textContent='No file selected.';return}
    if(file.size>65536){backupStatus.textContent='That file is too large for a game-save backup.';return}
    try{const data=JSON.parse(await file.text());if(data.format!=='kats-corner-saves'||data.version!==1||!data.saves||typeof data.saves!=='object'||Array.isArray(data.saves))throw Error('This is not a Kat’s Corner game-save backup.');
      const keys=Object.keys(data.saves);if(!keys.length||keys.some(key=>!gameKeys.includes(key)||!valid(key,data.saves[key])))throw Error('This backup contains invalid or unsupported saves.');
      pending=data.saves;backupStatus.textContent=`Ready to import ${keys.length} saved ${keys.length===1?'record':'records'}: ${keys.map(key=>({'kats-corner-choose-your-fate-v1':'Story','kats-corner-monsters':'Monsters','fae-fate-cottage':'Cottage','kats-corner-goblin-best':'Goblin score','kats-corner-potion-best':'Potion score','kats-corner-spellbook-miscasts-v1':'Spellbook'}[key])).join(', ')}. Those records will replace the matching saves in this browser.`;confirm.disabled=false;
    }catch(error){backupStatus.textContent=error.message||'Could not read this backup.'}
  });
  confirm.addEventListener('click',()=>{if(!pending)return;const previous={};try{for(const key of Object.keys(pending))previous[key]=localStorage.getItem(key);for(const [key,value] of Object.entries(pending))localStorage.setItem(key,JSON.stringify(value));location.reload()}catch{for(const [key,value] of Object.entries(previous)){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}catch{}}backupStatus.textContent='This browser could not save the imported records.'}});
})();
