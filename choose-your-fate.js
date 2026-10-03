/* Story and endings restored from the archived first game. */
const ENDINGS = {
  knight: { icon: '⚔', title: 'The Accidental Knight', text: 'You saved the kingdom by doing the brave thing before anyone could talk you out of it. The sword is still glowing. Nobody knows how to turn it off.', tag: 'HEROIC, SOMEHOW', stats: ['Bravery: 94%', 'Planning: optional'] },
  mage: { icon: '✧', title: 'The Curious Mage', text: 'You asked enough questions to discover the forest was enchanted by a very dramatic spell. You fixed it. The forest now sends you fan mail.', tag: 'MAGICALLY INCLINED', stats: ['Magic: 97%', 'Curiosity: dangerous'] },
  rogue: { icon: '◈', title: 'The Charming Rogue', text: 'You slipped past every trap and left with the treasure, the map, and a suspicious number of spare keys. Nobody saw a thing.', tag: 'MORALLY FLEXIBLE', stats: ['Stealth: 89%', 'Pockets: full'] },
  healer: { icon: '✿', title: 'The Reluctant Healer', text: 'You survived with common sense, snacks, and a surprisingly effective potion. Even the cursed wolf seems to be feeling better.', tag: 'A VERY GOOD EGG', stats: ['Kindness: 98%', 'Snacks: plentiful'] },
  necromancer: { icon: '☾', title: 'The Polite Necromancer', text: 'You accidentally woke the ancient dead. Fortunately, they mostly wanted directions and a cup of tea. You are now their favorite person.', tag: 'ODDLY WHOLESOME', stats: ['Spooky: 87%', 'Manners: impeccable'] },
  dragon: { icon: '🐉', title: 'Dragon Friend', text: 'You ignored the main quest and adopted the tiny dragon. The kingdom was saved eventually. Your new child is asleep in your backpack.', tag: 'GOOD END', stats: ['Heroism: 34%', 'Dragon parenting: 100%'] },
  tavern: { icon: '♜', title: 'The Tavern Owner', text: 'You decided the whole adventure seemed suspicious and opened a pub instead. The kingdom was eventually saved by somebody else. You are financially stable.', tag: 'ARGUABLY THE BEST END', stats: ['Common sense: 100%', 'Business: thriving'] },
  hidden: { icon: '🗝', title: 'Keeper of the Unwritten Door', text: 'You found the door the forest had forgotten to draw. The smallest dragon hands you the key, and together you add a whole new page to the story. The forest keeps your secret, for now.', tag: 'THE HIDDEN PAGE', stats: ['Curiosity: immeasurable', 'Secret doors: 1'] }
};

const SCENES = {
  opening: {
    kicker: 'SOMEWHERE IN AN ENCHANTED FOREST',
    title: 'You wake up in a suspiciously magical forest.',
    text: 'There is a glowing sword, a tiny angry dragon, and a cottage with smoke curling from the chimney. What do you investigate first?',
    choices: [
      { icon: '⚔', text: 'Pull the glowing sword from the stone.', points: { knight: 3 }, flag: 'sword', next: 'sword' },
      { icon: '🐉', text: 'Introduce yourself to the tiny angry dragon.', points: { dragon: 3, healer: 1 }, flag: 'dragon', achievement: 'pet', next: 'dragon' },
      { icon: '⌂', text: 'Knock politely on the cottage door.', points: { healer: 2, tavern: 1 }, flag: 'cottage', next: 'cottage' }
    ]
  },
  sword: {
    kicker: 'THE SWORD IS BEING WEIRD',
    title: 'The sword comes loose. So does an entire prophecy.',
    text: 'An owl wearing spectacles declares you “The Chosen One.” It has a contract for you to sign.',
    choices: [
      { icon: '✧', text: 'Read the fine print and question the owl.', points: { mage: 3 }, next: 'amulet' },
      { icon: '⚔', text: 'Accept your destiny. Dramatically.', points: { knight: 3 }, next: 'amulet' },
      { icon: '◈', text: 'Borrow the map and quietly leave.', points: { rogue: 3 }, next: 'amulet' }
    ]
  },
  dragon: {
    kicker: 'VERY SMALL, VERY LOUD',
    title: 'The dragon hisses at your shoes.',
    text: 'It is guarding a backpack approximately twice its size. Its tiny claws are shaking a little.',
    choices: [
      { icon: '✿', text: 'Offer a snack and check if it is okay.', points: { dragon: 3, healer: 2 }, achievement: 'pet', next: 'amulet' },
      { icon: '◈', text: 'Sneak a peek inside the backpack.', points: { rogue: 3 }, next: 'amulet' },
      { icon: '✧', text: 'Ask why the backpack is glowing.', points: { mage: 3 }, next: 'amulet' }
    ]
  },
  cottage: {
    kicker: 'SOMEONE PUT THE KETTLE ON',
    title: 'A witch invites you inside for tea.',
    text: 'She offers a map, a potion, and advice that sounds suspiciously sensible.',
    choices: [
      { icon: '✿', text: 'Help her tend to an injured fox.', points: { healer: 4 }, next: 'amulet' },
      { icon: '☾', text: 'Ask about the whispering spellbook.', points: { necromancer: 4 }, next: 'amulet' },
      { icon: '♜', text: 'Ask if the cottage is for sale.', points: { tavern: 4 }, next: 'amulet' }
    ]
  },
  amulet: {
    kicker: 'CHAPTER THREE: RED FLAGS',
    title: 'A stranger offers you a glowing amulet.',
    text: '“Not cursed,” they say, entirely unprompted. It does look very pretty, though.',
    choices: [
      { icon: '☾', text: 'Accept it. Pretty necklace.', points: { necromancer: 4 }, next: 'dragonMeeting' },
      { icon: '✿', text: 'Absolutely not. I have pattern recognition.', points: { healer: 2, rogue: 1, tavern: 1 }, achievement: 'pattern', next: 'dragonMeeting' },
      { icon: '✧', text: 'Ask if it comes in pink.', points: { mage: 3, dragon: 1 }, next: 'dragonMeeting' }
    ]
  },
  dragonMeeting: {
    kicker: 'CHAPTER FOUR: A COMPLICATION',
    title: 'The tiny dragon has decided you belong to it.',
    text: 'It trots after you with the confidence of a creature that has never paid rent. What now?',
    choices: [
      { icon: '🐉', text: 'Accept your new child.', points: { dragon: 5 }, flag: 'adopted', achievement: 'pet', next: 'finale' },
      { icon: '✧', text: 'Attempt diplomatic negotiations.', points: { mage: 2, knight: 1 }, next: 'finale' },
      { icon: '♜', text: 'Explain that you cannot financially support a dragon.', points: { tavern: 3 }, next: 'finale' }
    ]
  },
  finale: {
    kicker: 'THE LAST DECISION',
    title: 'At the forest crossroads, destiny waits.',
    text: 'A castle needs help, a dark tower glimmers on the hill, and the village has a vacant storefront. The dragon is trying to eat the signpost.',
    choices: [
      { icon: '⚔', text: 'Head for the castle and save the day.', points: { knight: 4, healer: 1 }, next: 'result' },
      { icon: '☾', text: 'Investigate the mysterious tower.', points: { necromancer: 3, mage: 2, rogue: 1 }, next: 'result' },
      { icon: '♜', text: 'Forget the quest. Open that pub.', points: { tavern: 7 }, flag: 'pub', next: 'result' },
      { icon: '🐉', text: 'Take the dragon home instead.', points: { dragon: 7 }, flag: 'home', achievement: 'sidequest', next: 'result' }
    ]
  },
  secretLantern: {
    kicker: 'A PAGE THAT WAS NOT THERE BEFORE',
    title: 'The forest parts around a tiny brass key.',
    text: 'Behind a curtain of leaves, a lantern swings over a path nobody put on the map. A very small dragon watches you expectantly.',
    choices: [
      { icon: '🗝', text: 'Pocket the key and follow the lantern.', next: 'secretArchive' },
      { icon: '🐉', text: 'Ask the dragon to lead the way.', next: 'secretArchive' }
    ]
  },
  secretArchive: {
    kicker: 'CHAPTER THREE: THE UNWRITTEN ROOM',
    title: 'An archive of unfinished stories waits inside.',
    text: 'Every shelf contains a different almost-ending. One book has your name on its blank cover.',
    choices: [
      { icon: '✒', text: 'Open your book to its first blank page.', next: 'secretInk' },
      { icon: '✿', text: 'Leave a flower between its pages.', next: 'secretInk' }
    ]
  },
  secretInk: {
    kicker: 'CHAPTER FOUR: A VERY ODD PEN',
    title: 'The ink begins to write back.',
    text: 'It asks for one word to describe the adventure you wish existed. The dragon is loudly voting for “snacks.”',
    choices: [
      { icon: '♡', text: 'Write “wonder.”', next: 'secretDoor' },
      { icon: '🍪', text: 'Write “snacks.” The dragon has a point.', next: 'secretDoor' }
    ]
  },
  secretDoor: {
    kicker: 'THE LAST UNWRITTEN LINE',
    title: 'A door appears in the final paragraph.',
    text: 'The key fits. Beyond it, the forest is waiting for its next storyteller.',
    choices: [
      { icon: '🗝', text: 'Turn the key and step into the story.', next: 'result' },
      { icon: '🐉', text: 'Let the tiny dragon go first, then follow.', next: 'result' }
    ]
  }
};

/* One self-contained game. No site-wide theme, scoreboard, or other game systems. */
(() => {
  const $ = id => document.getElementById(id);
  const STORAGE = 'kats-corner-choose-your-fate-v1';
  let saved = { endings: [], decisions: 0, sound: true };
  try {
    const previous = JSON.parse(localStorage.getItem(STORAGE) || '{}');
    if (Array.isArray(previous.endings)) saved.endings = previous.endings.filter(key => Object.hasOwn(ENDINGS,key));
    if (Number.isInteger(previous.decisions) && previous.decisions >= 0) saved.decisions = previous.decisions;
    if (typeof previous.sound === 'boolean') saved.sound = previous.sound;
  } catch { /* The game also works when storage is unavailable. */ }
  const persist = () => { try { localStorage.setItem(STORAGE,JSON.stringify(saved)); } catch {} };
  let audio;
  function chime(type) {
    if (!saved.sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const notes = {
        start: [[440,0],[660,.09],[880,.18]],
        choice: [[520,0],[690,.07]],
        ending: [[523,0],[659,.12],[784,.24],[1046,.36]],
        restart: [[650,0],[450,.12]]
      }[type] || [[520,0]];
      const now = audio.currentTime;
      notes.forEach(([pitch,offset]) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type = type === 'ending' ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(pitch,now+offset);
        gain.gain.setValueAtTime(.0001,now+offset);
        gain.gain.exponentialRampToValueAtTime(.055,now+offset+.015);
        gain.gain.exponentialRampToValueAtTime(.0001,now+offset+.19);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(now+offset);oscillator.stop(now+offset+.2);
      });
    } catch { /* Audio is decorative; choices still work. */ }
  }
  let run = null;
  const iconNames = {'⚔':'sword','🐉':'dragon','⌂':'cottage','✿':'cottage','✧':'amulet','◈':'tower','☾':'tower','♜':'tavern','🗝':'amulet','✒':'amulet','♡':'dragon','🍪':'dragon'};
  const endingIcons = {knight:'sword',mage:'amulet',rogue:'tower',healer:'cottage',necromancer:'tower',dragon:'dragon',tavern:'tavern',hidden:'amulet'};
  const setProgress = value => {
    $('game-progress').value = value;
    $('game-progress-label').textContent = `${Math.min(value,5)} / 5`;
  };
  function intro() {
    setProgress(0);
    $('game-restart').hidden = true;
    const content = $('game-content');content.replaceChildren();
    const label = document.createElement('p');label.className='eyebrow';label.textContent='Quest 001 · choose your fate';
    const heading = document.createElement('h3');heading.textContent='A forest. A prophecy. Absolutely no instructions.';
    const description = document.createElement('p');description.textContent='Make five decisions and find out which ending you earned. Your discoveries stay on this device.';
    const start = document.createElement('button');start.type='button';start.className='primary';start.textContent='Start the adventure';start.addEventListener('click',startRun);
    content.append(label,heading,description,start);
  }
  function startRun() {
    run={scene:'opening',step:0,scores:Object.fromEntries(Object.keys(ENDINGS).map(key=>[key,0])),flags:[]};
    $('game-restart').hidden=false;
    chime('start');renderScene();
  }
  function renderScene() {
    const scene = SCENES[run.scene];
    if (!scene) { intro();return; }
    setProgress(run.step+1);
    const content=$('game-content');content.replaceChildren();
    const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent=scene.kicker;
    const heading=document.createElement('h3');heading.tabIndex=-1;heading.textContent=scene.title;
    const copy=document.createElement('p');copy.textContent=scene.text;
    const choices=document.createElement('div');choices.className='game-choices';
    const options=scene.choices.slice();
    if (run.scene === 'opening' && saved.decisions >= 13) options.push({icon:'🗝',text:'Follow the little key-shaped glimmer between the trees.',flag:'secretRoute',next:'secretLantern'});
    options.forEach(choice=>{
      const button=document.createElement('button');button.type='button';button.className='game-choice';
      const icon=document.createElement('span');icon.className='choice-art';icon.dataset.icon=iconNames[choice.icon]||'amulet';icon.setAttribute('aria-hidden','true');
      const words=document.createElement('span');words.textContent=choice.text;
      button.append(icon,words);button.addEventListener('click',()=>choose(choice));choices.append(button);
    });
    content.append(kicker,heading,copy,choices);
    if (run.step) heading.focus({preventScroll:true});
  }
  function choose(choice) {
    for(const [key,points] of Object.entries(choice.points||{})) run.scores[key]+=points;
    if(choice.flag)run.flags.push(choice.flag);
    saved.decisions++;persist();run.step++;
    chime('choice');
    if(choice.next==='result')showEnding();
    else {run.scene=choice.next;renderScene();}
  }
  function getEnding() {
    if(run.flags.includes('secretRoute'))return 'hidden';
    if(run.flags.includes('home'))return 'dragon';
    if(run.flags.includes('pub'))return 'tavern';
    return Object.keys(ENDINGS).filter(key=>key!=='hidden').reduce((best,key)=>run.scores[key]>run.scores[best]?key:best);
  }
  function showEnding() {
    setProgress(5);
    const key=getEnding(),ending=ENDINGS[key],isNew=!saved.endings.includes(key);
    if(isNew){saved.endings.push(key);persist();}
    const content=$('game-content');content.replaceChildren();
    const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent=isNew?'A new ending discovered':'An ending revisited';
    const heading=document.createElement('h3');heading.className='ending-title';heading.tabIndex=-1;
    const icon=document.createElement('span');icon.className='choice-art ending-art';icon.dataset.icon=endingIcons[key];icon.setAttribute('aria-hidden','true');
    const title=document.createElement('span');title.textContent=ending.title;
    heading.append(icon,title);
    const tag=document.createElement('p');tag.className='result-tag';tag.textContent=ending.tag;
    const copy=document.createElement('p');copy.textContent=ending.text;
    const stats=document.createElement('p');stats.className='result-stats';stats.textContent=ending.stats.join(' · ');
    const count=document.createElement('p');count.className='result-count';count.textContent=`${saved.endings.length} of 8 endings found on this device`;
    const again=document.createElement('button');again.type='button';again.className='primary';again.textContent='Play again';again.addEventListener('click',startRun);
    content.append(kicker,heading,tag,copy,stats,count,again);
    chime('ending');heading.focus({preventScroll:true});
  }
  $('game-restart').addEventListener('click',()=>{chime('restart');startRun()});
  $('game-sound').addEventListener('click',()=>{
    saved.sound=!saved.sound;persist();updateSound();if(saved.sound)chime('choice');
  });
  function updateSound(){
    $('game-sound').setAttribute('aria-pressed',String(saved.sound));
    $('game-sound').textContent=`Sound: ${saved.sound?'On':'Off'}`;
  }
  updateSound();intro();
})();
