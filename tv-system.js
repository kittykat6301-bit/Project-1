/* The Storybox is part of the game shelf and every playable quest. */
(() => {
  const games=[['play','Choose Your Fate'],['monster','Adopt a Tiny Monster'],['homebuilder','Fantasy Home Builder'],['goblin','Goblin Grab'],['potion','Potion Problems'],['mimic','Mimic Hunt'],['spellbook','Spellbook Autocorrect']];
  const channels=[['KAT’S CORNER','CHOOSE A CARTRIDGE BELOW','PRESS START · MAKE TROUBLE · HAVE FUN'],['DRAGON WEATHER','CLOUDY WITH A CHANCE OF SNACKS','TINY ROARS FORECAST AFTER TEA'],['GOBLIN SHOPPING','EVERYTHING MUST GO!','POSSIBLY BECAUSE IT WAS STOLEN'],['COTTAGE CAM','THE KETTLE IS ON','BREAKING NEWS: HONEY BADGER NAPPING'],['THE MYSTERY CHANNEL','THIS CHANNEL IS HAUNTED','THE GHOST IS VERY POLITE'],['MEMAW’S PARLOR','TEA AT FOUR. QUESTS AT FIVE.','THE PURPLE ARMCHAIR KNOWS EVERYTHING'],['GERALD FM','BEEP BOOP. HEART.EXE IS WARM.','PINK NEON HEARTS AT MIDNIGHT']];
  const shelf=document.getElementById('games');
  const states=new Map();let tvOn=true,consoleOn=true,queued=null,bootTimer=null,channel=0;
  const currentTheme=()=>document.documentElement.dataset.theme||'classic';
  function route(){return location.hash.slice(1).toLowerCase()}
  function activeStage(){return route()==='games'?states.get('shelf'):route()==='play'?states.get('play'):games.some(game=>game[0]===route())?states.get('arcade'):states.get('shelf')}
  window.katsTvPlayable=()=>tvOn&&consoleOn&&!(activeStage()?.channelOpen);
  function createStage(key){
    const stage=document.createElement('div');stage.className='tv-stage';stage.dataset.stage=key;
    stage.innerHTML=`<div class="tv-set"><div class="tv-screen" role="region" aria-label="Game screen"><div class="tv-screen-inner"></div><div class="tv-channel-overlay" hidden></div><div class="tv-signal-overlay" hidden></div></div><div class="tv-panel"><div class="tv-title"><strong>KAT’S STORYBOX</strong><small>MAGIC-VISION COLOR TV</small></div><span class="tv-indicator" aria-label="Power on"></span><button type="button" class="tv-channel" aria-label="Change silly TV channel">CH ↻</button><button type="button" class="tv-fullscreen" aria-label="Expand TV full screen">⛶ Full screen</button><button type="button" class="tv-power" aria-pressed="true" aria-label="Turn TV off">⏻</button></div></div><div class="tv-console"><div class="tv-console-top"><strong>KAT’S QUEST CONSOLE</strong><button type="button" class="console-power" aria-pressed="true" aria-label="Turn console off">POWER</button></div><div class="tv-console-slot" aria-label="Cartridge slot"></div><div class="tv-cartridge" aria-live="polite"><img alt="" data-game-id="play"><span>CHOOSE YOUR FATE</span></div><div class="tv-console-bottom"><span>✦ CARTRIDGE LOADED</span><button type="button" class="tv-eject">⏏ EJECT</button></div></div><p class="tv-status" role="status"></p>`;
    const state={stage,key,channelOpen:false};states.set(key,state);
    stage.querySelector('.tv-power').addEventListener('click',()=>{tvOn=!tvOn;renderPower();if(tvOn)resume();else stopBoot('The TV has gone to sleep. Shhh.')});
    stage.querySelector('.console-power').addEventListener('click',()=>{consoleOn=!consoleOn;renderPower();if(consoleOn)resume();else stopBoot('The console is sleeping. The TV still works.')});
    stage.querySelector('.tv-channel').addEventListener('click',()=>{
      if(!tvOn){say(state,'The TV is off. The channel is dramatic silence.');return}
      if(!consoleOn){say(state,'The console is sleeping. Turn it on for the silly channels.');return}
      if(bootTimer){say(state,'Give the tiny TV a moment to boot.');return}
      channel=(channel+1)%channels.length;state.channelOpen=key!=='shelf'?!state.channelOpen:false;
      const overlay=stage.querySelector('.tv-channel-overlay');overlay.replaceChildren();
      if((key==='shelf'&&channel!==0)||state.channelOpen){for(const [index,value] of channels[channel].entries()){const el=document.createElement(index===0?'strong':index===1?'span':'small');el.textContent=value;overlay.append(el)}overlay.hidden=false}else overlay.hidden=true;
      say(state,state.channelOpen?'Silly channel selected. Press CH again to return to your game.':channels[channel][0]);
    });
    stage.querySelector('.tv-fullscreen').addEventListener('click',()=>{const expanded=stage.classList.toggle('tv-expanded');stage.querySelector('.tv-fullscreen').textContent=expanded?'⤢ Exit full screen':'⛶ Full screen';stage.querySelector('.tv-fullscreen').setAttribute('aria-label',expanded?'Exit full screen':'Expand TV full screen');document.body.classList.toggle('tv-has-expanded',expanded);if(expanded)stage.querySelector('.tv-fullscreen').focus()});
    stage.querySelector('.tv-eject').addEventListener('click',()=>{if(bootTimer)clearTimeout(bootTimer);bootTimer=null;queued=null;stage.classList.remove('tv-booting');setCartridge('play');say(state,'⏏ Cartridge ejected. It lands with a tiny plonk.');if(key!=='shelf')location.hash='games'});
    return stage;
  }
  function say(state,message){state.stage.querySelector('.tv-status').textContent=message}
  function renderPower(){for(const {stage,key} of states.values()){
    stage.classList.toggle('tv-off',!tvOn);stage.classList.toggle('console-off',!consoleOn);
    const tv=stage.querySelector('.tv-power'),consoleButton=stage.querySelector('.console-power');
    tv.setAttribute('aria-pressed',String(tvOn));tv.setAttribute('aria-label',tvOn?'Turn TV off':'Turn TV on');
    consoleButton.setAttribute('aria-pressed',String(consoleOn));consoleButton.setAttribute('aria-label',consoleOn?'Turn console off':'Turn console on');
    stage.querySelector('.tv-indicator').setAttribute('aria-label',tvOn?'Power on':'Power off');
    const overlay=stage.querySelector('.tv-signal-overlay');overlay.textContent=!tvOn?'':!consoleOn?'NO SIGNAL':'';overlay.hidden=tvOn&&consoleOn;
    if(key==='shelf')stage.querySelector('.tv-channel-overlay').hidden=!(tvOn&&consoleOn&&channel!==0);
  }}
  function stopBoot(message){if(!bootTimer)return;clearTimeout(bootTimer);bootTimer=null;const state=states.get('shelf');state.stage.classList.remove('tv-booting');say(state,message)}
  function setCartridge(id){const game=games.find(item=>item[0]===id)||games[0];for(const state of states.values()){if(state.key==='shelf'||state.key===id||(state.key==='arcade'&&id!=='play')){const cart=state.stage.querySelector('.tv-cartridge');cart.querySelector('span').textContent=game[1].toUpperCase();cart.querySelector('img').dataset.gameId=id;cart.querySelector('img').src=window.themeGameArt?.(id)||'/assets/choose-your-fate-cartridge.png'}}}
  function boot(id){const state=states.get('shelf');if(bootTimer)return;setCartridge(id);state.stage.classList.add('tv-booting');state.stage.querySelector('.tv-channel-overlay').hidden=true;say(state,`Loading ${games.find(item=>item[0]===id)?.[1]}…`);
    bootTimer=setTimeout(()=>{bootTimer=null;state.stage.classList.remove('tv-booting');queued=null;location.hash=id;},1100);
  }
  function resume(){if(tvOn&&consoleOn&&queued){const id=queued;queued=null;boot(id)}}
  function select(id){if(!games.some(item=>item[0]===id))return;queued=id;if(!tvOn||!consoleOn){setCartridge(id);say(states.get('shelf'),`Cartridge seated. Turn on the ${!tvOn?'TV':'console'} to play.`);return}boot(id)}
  const shelfStage=createStage('shelf');shelf.querySelector('.game-card').before(shelfStage);
  const menu=document.createElement('div');menu.className='tv-menu';menu.innerHTML='<p>CHOOSE A CARTRIDGE</p><div></div><small>PRESS START · MAKE TROUBLE · HAVE FUN</small>';
  for(const [id,title] of games){const button=document.createElement('button');button.type='button';button.dataset.loadGame=id;button.textContent=title;menu.querySelector('div').append(button)}
  const broadcast=document.createElement('div');broadcast.className='tv-broadcast';broadcast.innerHTML='<span class="tv-star">✦</span><strong>KAT’S CORNER</strong><span>CHOOSE A CARTRIDGE BELOW</span><small>PRESS START · MAKE TROUBLE · HAVE FUN</small>';
  shelfStage.querySelector('.tv-screen-inner').append(broadcast,menu);
  const playStage=createStage('play');document.querySelector('#play .game-head').after(playStage);
  for(const id of ['game-hero','game-meter','game-content']){const node=document.getElementById(id);if(node)playStage.querySelector('.tv-screen-inner').append(node)}
  const arcadeStage=createStage('arcade');document.querySelector('#arcade-game .game-head').after(arcadeStage);
  for(const id of ['arcade-hero','arcade-content'])arcadeStage.querySelector('.tv-screen-inner').append(document.getElementById(id));
  // One shared game TV serves the six quests that use the same route.
  document.addEventListener('click',event=>{const menuButton=event.target.closest('[data-load-game]');if(menuButton){select(menuButton.dataset.loadGame);return}
    const link=event.target.closest('#games .game-card a[href^="#"]');if(link){const id=link.getAttribute('href').slice(1);if(games.some(game=>game[0]===id)){event.preventDefault();select(id)}}});
  function syncRoute(){const id=route();if(id!=='games'&&shelfStage.classList.contains('tv-expanded'))shelfStage.querySelector('.tv-fullscreen').click();if(id==='games'){shelfStage.querySelector('.tv-channel-overlay').hidden=!(tvOn&&consoleOn&&channel!==0)}else if(games.some(game=>game[0]===id)){setCartridge(id);const state=id==='play'?states.get('play'):states.get('arcade');state.channelOpen=false;state.stage.querySelector('.tv-channel-overlay').hidden=true}
    if(!['games','play',...games.map(game=>game[0])].includes(id))for(const state of [states.get('shelf'),states.get('play'),states.get('arcade')]){state.stage.classList.remove('tv-expanded');state.stage.querySelector('.tv-fullscreen').textContent='⛶ Full screen'}document.body.classList.remove('tv-has-expanded')}
  addEventListener('hashchange',syncRoute);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){for(const state of [states.get('shelf'),states.get('play'),states.get('arcade')]){if(state.stage.classList.contains('tv-expanded')){state.stage.querySelector('.tv-fullscreen').click();break}}}});
  const hardwareNames={classic:['KAT’S ARCADE','PASTEL QUEST CABINET'], 'game-room':['KAT’S STORYBOX','CLASSIC COLOR TV'],kat:['KAT’S STORYBOX','GOBLIN EDITION'],gerald:['ARCHIVE TERMINAL','GERALD CORE · DISPLAY 01'],alex:['RED LANTERN SCREEN','CINEMA LOUNGE COLOR TV'],dad:['GUILD STORYBOX','EVERGREEN QUEST DISPLAY'],ma:['ROSEWOOD STORYBOX','GARDEN DESK COLOR TV'],midnight:['MIDNIGHT TERMINAL','PHOSPHOR CRT DISPLAY'],fantasy:['THE INN STORYBOX','RUNE COLOR TV'],cozy:['COZY CONSOLE','THE FAMILY DEN'],memaw:['LAVENDER STORYBOX','MEMAW’S PARLOR'],derek:['BUBBLEWOOD STORYBOX','COTTAGE COLOR TV'],mama:['AUTUMN PEAK TV','HOMESTEAD QUEST DECK'],hayley:['HONEYBELL STORYBOX','WOODLAND QUEST TV'],emmy:['SECOND-LIFE SCREEN','CINEMA CAFÉ QUEST DECK'],journey:['MOON KEEP DISPLAY','CRIMSON ARCHIVE TV'],spencer:['HERO LAUNCHPAD','MISSION CONTROL DISPLAY']};
  function updateHardware(){const theme=currentTheme(),names=hardwareNames[theme]||hardwareNames.classic;for(const state of states.values()){state.stage.querySelector('.tv-title strong').textContent=names[0];state.stage.querySelector('.tv-title small').textContent=names[1];state.stage.querySelector('.tv-console-top strong').textContent=theme==='alex'?'RED LANTERN EDITING DECK':theme==='gerald'?'ARCHIVE QUEST DRIVE':theme==='spencer'?'MISSION GAME DOCK':theme==='dad'?'GUILD QUEST DECK':theme==='ma'?'GARDEN GAME CONSOLE':'KAT’S QUEST CONSOLE'}broadcast.querySelector('span:not(.tv-star)').textContent=theme==='alex'?'SELECT A FEATURE BELOW':'CHOOSE A CARTRIDGE BELOW'}
  document.addEventListener('kats-theme-change',()=>{updateHardware();for(const state of states.values()){const image=state.stage.querySelector('.tv-cartridge img');image.src=window.themeGameArt?.(image.dataset.gameId)||image.src}});
  setCartridge('play');updateHardware();renderPower();syncRoute();
})();
