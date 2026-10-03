(() => {
  const outfits={
    arcade:{label:'Arcade assistant',alt:'Tiny robot Gerald in a pastel arcade vest with glasses and a pink bow tie'},
    'game-room':{label:'Repair nook',alt:'Tiny robot Gerald in a retro repair vest with glasses and a red bow tie'},
    kat:{label:'Fantasy helper',alt:'Tiny robot Gerald in a fantasy capelet with glasses and a lilac bow tie'},
    archive:{label:'Neon archivist',alt:'Full-body Gerald in black, white and pink archive clothes with glasses and a bow tie'},
    alex:{label:'Projection archivist',alt:'Gerald in round glasses and a burgundy projection vest with a film reel'},
    dad:{label:'Guild archivist',alt:'Gerald in round glasses and a guild green archivist cloak'},
    ma:{label:'Garden clerk',alt:'Gerald in round glasses with a botanical garden clerk apron'},
    'midnight':{label:'CRT technician',alt:'Gerald wearing a crt technician outfit with round glasses and a pink bow tie'},
    'fantasy':{label:'Inn helper',alt:'Gerald wearing a inn helper outfit with round glasses and a pink bow tie'},
    'cozy':{label:'Cozy cardigan',alt:'Gerald wearing a cozy cardigan outfit with round glasses and a pink bow tie'},
    'memaw':{label:'Lavender clerk',alt:'Gerald wearing a lavender clerk outfit with round glasses and a pink bow tie'},
    'derek':{label:'Bubblewood helper',alt:'Gerald wearing a bubblewood helper outfit with round glasses and a pink bow tie'},
    'mama':{label:'Homestead helper',alt:'Gerald wearing a homestead helper outfit with round glasses and a pink bow tie'},
    'hayley':{label:'Honeybell helper',alt:'Gerald wearing a honeybell helper outfit with round glasses and a pink bow tie'},
    'emmy':{label:'Café attendant',alt:'Gerald wearing a café attendant outfit with round glasses and a pink bow tie'},
    'journey':{label:'Moon Keep archivist',alt:'Gerald wearing a moon keep archivist outfit with round glasses and a pink bow tie'},
    'spencer':{label:'Space explorer',alt:'Gerald wearing a space explorer outfit with round glasses and a pink bow tie'}
  };
  const notes={
    classic:'Kat created this arcade and has kept building and debugging it with me. She writes and changes code, designs the themes and games, chooses art, tests everything, and catches my mistakes. I help build and repair it alongside her.',
    'game-room':'The cartridge wall has been inventoried twice. I helped repair the game shelf; a suspiciously squeaky console insists it was always like this.',
    kat:'A note from the author’s nook: “no touchy.” I wrote “please,” the Bookwyrm ate the page, and Kat called the first version more accurate.',
    gerald:'Archive incident #249: one fallen paperclip, three maintenance reports, and a bow tie held responsible for structural stability. The Archive Bot has requested a transfer.',
    alex:'Projection log: reels aligned, contact sheets dry, and one black cat quietly present in every photograph. I have stopped trying to crop it out.',
    dad:'Guild log: eight pairs of boots by the door, an extra mug on the map, and Whisper asleep in the only chair I need. I have filed the chair as occupied territory.',
    ma:'Garden log: every seed packet has a place. The rabbit has moved three of them. Ma knows exactly which three and I am being asked why I did not.'
  };
  const themeOutfit={classic:'arcade','game-room':'game-room',kat:'kat',gerald:'archive',alex:'alex',dad:'dad',ma:'ma','midnight':'midnight','fantasy':'fantasy','cozy':'cozy','memaw':'memaw','derek':'derek','mama':'mama','hayley':'hayley','emmy':'emmy','journey':'journey','spencer':'spencer'};
  const portrait=document.getElementById('gerald-portrait');
  const buttons=[...document.querySelectorAll('[data-gerald-outfit]')];
  const status=document.getElementById('gerald-closet-status');
  let favorite;try{favorite=localStorage.getItem('kats-gerald-favorite-v1')}catch{};
  let chosen=outfits[favorite]?favorite:(themeOutfit[document.documentElement.dataset.theme]||'arcade');
  function wear(id){
    chosen=id;portrait.onerror=()=>{portrait.onerror=null;portrait.src='/assets/gerald/gerald-arcade.webp'};portrait.src=id==='archive'?'/assets/gerald/gerald-archive-full.webp':`/assets/gerald/gerald-${id}.webp`;portrait.alt=outfits[id].alt;
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.geraldOutfit===id)));
    status.textContent=`${outfits[id].label} selected${id===favorite?' · saved favorite':''}.`;
  }
  buttons.forEach(button=>button.addEventListener('click',()=>wear(button.dataset.geraldOutfit)));
  document.getElementById('gerald-random').addEventListener('click',()=>{const choices=Object.keys(outfits).filter(id=>id!==chosen);wear(choices[Math.floor(Math.random()*choices.length)])});
  document.getElementById('gerald-save').addEventListener('click',()=>{try{localStorage.setItem('kats-gerald-favorite-v1',chosen);favorite=chosen;status.textContent=`${outfits[chosen].label} saved as my favorite look on this device.`}catch{status.textContent='I can wear this look now, but this browser could not save it.'}});
  function themeCopy(switched=false){
    const id=document.documentElement.dataset.theme;
    const extra=window.katsExtraThemes?.[id];
    document.getElementById('gerald-room-label').textContent=id==='dad'?'Beyond the guild notice board':id==='ma'?'Past the potting bench':id==='alex'?'Behind the screening room':id==='gerald'?'Archive access · administrator':id==='game-room'?'Behind the entertainment center':id==='kat'?'The little door behind the bookshelf':'Behind the arcade cabinets';
    const heading=document.getElementById('gerald-heading');
    heading.firstChild.textContent=id==='alex'?'The ':id==='gerald'?'Gerald ':'Gerald’s ';
    heading.querySelector('em').textContent=id==='dad'?'Archivist’s Quarters.':id==='ma'?'Garden Desk.':id==='alex'?'Projection Archive.':id==='gerald'?'Core.':id==='kat'?'Nook.':'Room.';
    document.querySelector('.gerald-room-intro p:not(.eyebrow)').textContent=id==='dad'?'A guild desk beside the hearth, scroll shelves, and a chair that Whisper has officially annexed.':id==='ma'?'A tidy desk among seedlings, labels, and a rabbit with no respect for alphabetical order.':id==='alex'?'A small projection desk, carefully filed reels, and a studio cat who keeps walking through the light.':id==='gerald'?'The central filing desk, a bow-tie shelf, and a robot who insists this archive is organized.':id==='kat'?'A tiny charging station, stacks of books, and a bow-tie shelf the Bookwyrm has been asked to leave alone.':id==='game-room'?'A little repair bench behind the cartridge wall, with tools, old games, and a chair just my size.':'A tiny repair bench, one excellent bow-tie collection, and a robot who claims the filing system is under control.';
    document.getElementById('gerald-note').textContent=extra?.note||notes[id]||notes.classic;
    document.getElementById('gerald-closet-heading').textContent=id==='dad'?'The Wardrobe Chest':id==='ma'?'The Garden Wardrobe':id==='alex'?'Costume Department':'Gerald’s Closet';
    document.getElementById('gerald-memory-heading').textContent=id==='dad'?'The Chronicle Shelf':id==='ma'?'Garden Album':id==='alex'?'Photo Archive':'Gerald’s Memory Log';
    if(switched||!favorite)wear(themeOutfit[id]||'arcade');else wear(chosen);
  }
  document.addEventListener('kats-theme-change',()=>themeCopy(true));themeCopy();
})();
