/* One selector; each finished world supplies its own room and game artwork. */
(() => {
  const root=document.documentElement,dialog=document.getElementById('theme-dialog');
  const open=document.getElementById('theme-open'),close=document.getElementById('theme-close');
  const cards=[...dialog.querySelectorAll('[data-preview-theme]')];
  const previewArt=document.getElementById('theme-preview-art');
  const previewTitle=document.getElementById('theme-preview-title');
  const previewDescription=document.getElementById('theme-preview-description');
  const previewIcons=document.getElementById('theme-preview-icons');
  const apply=document.getElementById('theme-apply');
  const themes={
    classic:{name:'Kat’s Corner Classic',description:'A cheerful pastel retro arcade with soft neon, colorful games and a little star-shaped sprite.',icons:['home','games','updates','gerald'],art:'/assets/default-icons/classic.png',title:'Pastel Arcade',brand:'the tiny pastel arcade',home:'Pastel arcade · fresh start',library:'The arcade shelf',intro:'The finished cartridges are back, each with fresh pastel artwork. Pick one to play.',color:'#f4cfdf'},
    'game-room':{name:'Classic Game Room',description:'A lived-in game room with wood paneling, cartridge shelves, a chunky CRT and warm lamp light.',icons:['home','games','updates','gerald'],art:'/assets/themes/game-room.webp',title:'Classic Game Room',brand:'the nostalgic game room',home:'Classic game room · fresh start',library:'The cartridge wall',intro:'Seven finished cartridges, each with its own retro game-room artwork. Pick one to play.',color:'#e8d4b9'},
    kat:{name:'Kat’s Goblin Author Den',description:'Kat’s salmon-pink fantasy writing den: books, a customized game shelf, Mini Kat and one stationery-eating bookwyrm.',icons:['home','games','updates','gerald'],art:'/assets/themes/kat-den.webp',title:'Kat’s Goblin Den',brand:'the goblin author’s corner',home:'The Goblin Den · Kat’s room',library:'The cartridge hoard',intro:'Seven tiny games in the hoard. Pick one before the Bookwyrm borrows its label.',color:'#f4b8be'},
    gerald:{name:'Gerald’s Neon Archive',description:'A black-and-pink machine library with actual books, archive bots, neon labels, and suspiciously theatrical maintenance reports.',icons:['home','games','updates','gerald'],art:'/assets/themes/gerald-neon-archive.webp',title:'Gerald’s Neon Archive',brand:'the robot archive',home:'Central Archive · file 001',library:'The Game Vault',intro:'Seven active game files. I have checked their labels, unlike certain people.',color:'#170f1c'},
    alex:{name:'Alex’s Red Lantern Cinema',description:'Alex’s warm mid-century Chinese cinema and analog photo studio: lacquer red, film reels, dark wood, and a black studio cat.',icons:['home','games','updates','gerald'],art:'/assets/themes/alex-cinema.webp',title:'The Red Lantern Cinema',brand:'the film house and photo studio',home:'The Cinema Lobby · Alex’s room',library:'The Projection Booth',intro:'Seven features ready for the screen. Select a film, then press play.',color:'#311b1a'},
    dad:{name:'Dad’s Evergreen Guildhall',description:'A lived-in forest guildhall with dark timber, maps, a stone hearth, and Whisper keeping watch.',icons:['home','games','updates','gerald'],art:'/assets/themes/dad-guildhall.webp',title:'Evergreen Guildhall',brand:'the warm forest guildhall',home:'Guildhall · Dad’s room',library:'The guild quest shelf',intro:'Seven adventures filed for the guild. Take one from the shelf.',color:'#243b32'},
    ma:{name:'Ma’s Rosewood Conservatory',description:'Ma/Janelle’s bright and capable botanical command center in ivory, sage and dusty rose.',icons:['home','games','updates','gerald'],art:'/assets/themes/ma-conservatory.webp',title:'Rosewood Conservatory',brand:'the botanical command center',home:'Conservatory · Ma’s room',library:'The garden game shelf',intro:'Seven games, in their proper places. Ma keeps a list.',color:'#d3dfcd'}
  };
  Object.assign(themes,window.katsExtraThemes||{});
  const current=()=>themes[root.dataset.theme]?root.dataset.theme:'classic';
  const gameArt=(id,theme=current())=>theme==='classic'?(id==='play'?'/assets/choose-your-fate-cartridge.png':`/assets/games/${id}-icon.webp`):`/assets/cartridges/${theme}-${id}.webp`;
  window.themeGameArt=id=>gameArt(id);
  let selected=current();
  function refreshImages(){
    const theme=themes[current()];
    document.querySelectorAll('img[data-game-id]').forEach(img=>{img.src=gameArt(img.dataset.gameId)});
    const active=location.hash.slice(1);
    if(['monster','homebuilder','goblin','potion','mimic','spellbook'].includes(active))document.getElementById('arcade-icon').src=gameArt(active);
    document.querySelector('.screen-cartridge').src=gameArt('play');
    document.querySelector('.brand small').textContent=theme.brand;
    document.querySelector('#home .eyebrow').textContent=theme.home;
    document.querySelector('#games > .eyebrow').textContent=theme.library;
    document.querySelector('#games > .intro').textContent=theme.intro;
    document.querySelector('[data-route="gerald"] .nav-label').textContent=theme.newWorld?'Gerald’s Room':current()==='kat'?'Gerald’s Nook':current()==='gerald'?'Gerald Core':current()==='alex'?'Projection Archive':current()==='dad'?'Archivist’s Quarters':current()==='ma'?'Garden Clerk':'Gerald’s Room';
    document.querySelector('#updates>.eyebrow').textContent=current()==='alex'?'The Marquee Board':current()==='dad'?'Guild Notice Board':current()==='ma'?'Garden Bulletin':'Gerald’s paperwork';
    document.querySelector('meta[name=theme-color]').content=theme.color;
    document.querySelector('footer span:last-child').textContent=theme.note|| (current()==='alex'?'The studio cat has final cut. — Gerald':current()==='gerald'?'Archive Bot has rejected my third shelf rearrangement. — Gerald':current()==='kat'?'The Bookwyrm has filed the bookmark under “snacks.” — Gerald':current()==='game-room'?'Please return the cartridges to their proper cases. — Gerald':current()==='dad'?'Whisper has claimed the best chair. Guild law, apparently. — Gerald':current()==='ma'?'The rabbit filed itself under urgent. I object. — Gerald':'I filed the demolition paperwork. The pink monster ate it. — Gerald');
    document.title=document.title.replace(/ · [^·]+$/,` · ${theme.title}`);
    document.dispatchEvent(new Event('kats-theme-change'));
  }
  function preview(id){
    selected=id;
    cards.forEach(card=>{const isSelected=card.dataset.previewTheme===id;card.setAttribute('aria-pressed',String(isSelected));card.querySelector('.theme-choice-state').textContent=card.dataset.previewTheme===current()?'CURRENT':''});
    previewTitle.textContent=themes[id].name;previewDescription.textContent=themes[id].description;
    previewArt.className=id==='classic'?'theme-preview-art classic-art':'theme-preview-art';
    previewArt.style.backgroundImage=id==='classic'?'':`url('${themes[id].art}')`;
    previewArt.setAttribute('aria-label',themes[id].newWorld?`${themes[id].room} illustrated setting`:id==='dad'?'Warm deep-green medieval guildhall with timber beams, a stone hearth and a forest view':id==='ma'?'Bright ivory and sage botanical conservatory with dusty rose flowers and a tidy desk':id==='alex'?'Illustrated 1950s cinema lobby and analog photography studio with red curtains and film reels':id==='gerald'?'Illustrated black-and-pink archive library with physical books, glowing shelves and CRT terminals':id==='kat'?'Illustrated pink goblin author cottage with books, manuscripts and a retro TV':id==='game-room'?'Illustrated wood-paneled rec room with CRT, cartridges and warm lamps':'Pastel arcade colors');
    previewIcons.replaceChildren(...(themes[id].newWorld?['play','monster','goblin']:themes[id].icons).map(icon=>{const img=document.createElement('img');img.src=themes[id].newWorld?gameArt(icon,id):id==='gerald'?`/assets/themes/gerald-nav-${icon}.webp`:`/assets/themes/${id}-${icon}.webp`;img.alt='';return img}));
    apply.disabled=id===current();apply.textContent=apply.disabled?'Current theme':'Apply theme';
  }
  open.addEventListener('click',()=>{preview(current());dialog.showModal()});
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>open.focus());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  cards.forEach(card=>card.addEventListener('click',()=>preview(card.dataset.previewTheme)));
  apply.addEventListener('click',()=>{
    if(selected===current())return;
    const previous=current(),image=new Image();apply.disabled=true;apply.textContent='Applying theme…';
    image.onload=()=>{
      try{localStorage.setItem('kats-corner-theme-v2',selected)}catch{}
      root.dataset.theme=selected;refreshImages();dialog.close();
    };
    image.onerror=()=>{root.dataset.theme=previous;previewDescription.textContent='Could not load that theme. The previous theme is still active.';apply.disabled=false;apply.textContent='Try again'};
    image.src=themes[selected].art;
  });
  refreshImages();
})();
