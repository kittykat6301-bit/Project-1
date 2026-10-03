/* Finished cartridges restored in sequence; each is independent of the theme system. */
(() => {
  const A='/assets/games/';
  const games=[
    {id:'monster',title:'Adopt a Tiny Monster',description:'Follow four nursery clues, hatch one of six little creatures, and give your new friend a name.',scene:'A cozy pastel nursery with enchanted eggs and tiny creatures'},
    {id:'homebuilder',title:'Fantasy Home Builder',description:'Choose your cottage walls, roof, sky, garden and roommate. Save your little home.',scene:'A pastel fantasy cottage beside a winding garden path'},
    {id:'goblin',title:'Goblin Grab',description:'Catch spinning and bonus coins before the guard arrives. Move the goblin with touch, mouse, or arrow keys.',scene:'A friendly goblin and a shower of coins at a pastel market'},
    {id:'potion',title:'Potion Problems',description:'Three visitors need remedies. Read their clues and brew with two ingredients each.',scene:'A pastel apothecary with glowing bottles and herbs'},
    {id:'mimic',title:'Mimic Hunt',description:'Inspect suspicious objects in three rooms and catch the disguised creatures.',scene:'An enchanted house with suspicious furniture and tiny hidden mimics'},
    {id:'spellbook',title:'Spellbook Autocorrect',description:'Supply the missing words in three spells. The book has other ideas.',scene:'An enchanted spellbook with magical scribbles in a pastel library'}
  ];
  const $=s=>document.querySelector(s), box=$('#arcade-content');
  const el=(tag,content,cls)=>{const n=document.createElement(tag);if(content!==undefined)n.textContent=content;if(cls)n.className=cls;return n;};
  const add=(parent,...children)=>{parent.append(...children);return parent;};
  const p=(message,cls)=>el('p',message,cls);
  const title=(message)=>el('h3',message);
  const button=(text,fn,cls='')=>{const n=el('button',text,cls);n.type='button';n.addEventListener('click',()=>{tone();fn();});return n;};
  const choices=(items)=>{const wrap=el('div',undefined,'arcade-choices');for(const [label,fn] of items)wrap.append(button(label,fn));return wrap;};
  const action=(text,fn)=>button(text,fn,'primary');
  const clear=(...nodes)=>box.replaceChildren(...nodes);
  const get=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const safeName=value=>value.trim().slice(0,40);
  let active='',audioOn=get('kats-arcade-sound',true),context=null,goblin=null;
  function tone(){if(!audioOn)return;try{context??=new (window.AudioContext||window.webkitAudioContext)();const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(540,context.currentTime);oscillator.frequency.exponentialRampToValueAtTime(760,context.currentTime+.09);gain.gain.setValueAtTime(.035,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.14);oscillator.connect(gain).connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.15)}catch{}}
  function updateSound(){const n=$('#arcade-sound');n.textContent=`Sound: ${audioOn?'On':'Off'}`;n.setAttribute('aria-pressed',String(audioOn));}
  $('#arcade-sound').addEventListener('click',()=>{audioOn=!audioOn;save('kats-arcade-sound',audioOn);updateSound();if(audioOn)tone()});
  $('#arcade-restart').addEventListener('click',()=>{tone();start(active)});
  for(let i=0;i<games.length;i++){
    const game=games[i],card=el('article',undefined,'game-card'),art=el('div',undefined,'game-card-art'),img=el('img');img.dataset.gameId=game.id;img.src=window.themeGameArt?.(game.id)||`${A}${game.id}-icon.webp`;img.alt=`Illustration for ${game.title}`;art.append(img);
    const copy=el('div');add(copy,p(`Quest ${String(i+2).padStart(3,'0')} · playable now`,'eyebrow'),title(game.title),p(game.description));const link=el('a','Play this game','primary');link.href=`#${game.id}`;copy.append(link);card.append(art,copy);$('#other-games').append(card);
  }
  function start(id){if(!id)return;stopGoblin();active=id;({monster:monsterStart,homebuilder:homeStart,goblin:goblinStart,potion:potionStart,mimic:mimicStart,spellbook:spellStart})[id]?.()}
  window.stopArcadeGame=()=>stopGoblin();
  window.renderArcadeGame=id=>{const game=games.find(item=>item.id===id);if(!game)return;$('#arcade-heading').textContent=game.title;$('#arcade-quest').textContent=`Quest ${String(games.indexOf(game)+2).padStart(3,'0')}`;$('#arcade-icon').src=window.themeGameArt?.(id)||`${A}${id}-icon.webp`;$('#arcade-hero').src=`${A}${id}-scene.webp`;$('#arcade-hero').alt=game.scene;$('#arcade-hero').hidden=id==='goblin'||id==='homebuilder';document.title=`${game.title} · ${document.documentElement.dataset.theme==='kat'?'Kat’s Goblin Den':document.documentElement.dataset.theme==='gerald'?'Gerald’s Neon Archive':document.documentElement.dataset.theme==='alex'?'The Red Lantern Cinema':document.documentElement.dataset.theme==='game-room'?'Classic Game Room':'Pastel Arcade'}`;start(id)};
  updateSound();

  /* Quest 002: the four nursery choices determine the creature. */
  const creatures={
    spriglet:['Spriglet','Moss','A soft forest creature with leaves for ears. It grows flowers in your pockets when you need cheering up.','Collects warm socks.'],
    puffwyrm:['Puffwyrm','Pip','A palm-sized dragon with a heart too big for its wings. It puffs pink smoke when it wants a cuddle.','Roars at teaspoons.'],
    moonbun:['Moonbun','Luma','A star-dusted rabbit with a talent for finding lost things. It sleeps inside your spellbook.','Sneezes glitter.'],
    mimic:['Pocket Mimic','Button','A shapeshifter smaller than a boot. It has chosen you as its favorite hiding place.','Pretends to be your keys.'],
    bubble:['Bubble Imp','Bloop','A floating little menace that sees the world in rainbow colors.','Bounces off ceilings.'],
    ember:['Emberling','Cinder','A tiny salamander with brave heart and pleasantly warm paws.','Toasts its own snacks.']
  };
  const nursery=[
    ['Three eggs are waiting for someone.','Which egg in the nursery illustration do you carry home?',[
      ['The blue egg with little wings and fluffy clouds.',{moonbun:3,bubble:1},'cloud'],
      ['The pink egg with a painted tulip and petals.',{spriglet:3,ember:1},'flower'],
      ['The purple egg with moonlight, stars and dark wings.',{puffwyrm:3,mimic:1},'moon']
    ]],
    ['Your egg chooses its favorite nest.','Look at the three nests beneath the eggs. Where does it settle?',[
      ['The soft, cloud-white nest on the left.',{moonbun:2,bubble:3}],
      ['The mossy flower nest in the middle.',{spriglet:3,ember:1}],
      ['The dusky nest dotted with stars on the right.',{puffwyrm:3,mimic:2}]
    ]],
    ['Something in the nursery answers its tapping.','Which detail catches your eye?',[
      ['The hanging stars begin to shimmer.',{moonbun:3,puffwyrm:1}],
      ['The lanterns glow warm and bright.',{ember:5,spriglet:1}],
      ['A little creature on the shelf makes a suspicious noise.',{mimic:4,bubble:3}]
    ]],
    ['One last look around the room.','Where does your egg want to go?',[
      ['Toward the garden beyond the round window.',{spriglet:3,bubble:4}],
      ['Under the crescent moon and dangling stars.',{moonbun:3,puffwyrm:3}],
      ['After the pink yarn ball on the nursery floor.',{mimic:5,ember:3}]
    ]]
  ];
  let nurseryStep=0,scores={},chosenEgg='';
  function monsterStart(){nurseryStep=0;scores={};chosenEgg='';monsterStep()}
  function monsterStep(){
    const step=nursery[nurseryStep],list=el('div',undefined,'arcade-choices');
    for(const [label,points,egg] of step[2]){
      const choice=button(label,()=>{if(egg)chosenEgg=egg;for(const [key,value] of Object.entries(points))scores[key]=(scores[key]||0)+value;nurseryStep++;nurseryStep<nursery.length?monsterStep():monsterFinish()});
      if(egg){const img=el('img');img.src=`${A}egg-${egg}.webp`;img.alt='';img.className='egg-choice-art';choice.prepend(img)}
      list.append(choice);
    }
    const nodes=[p(`Nursery visit · ${nurseryStep+1} / 4`,'eyebrow'),title(step[0]),p(step[1])];
    if(nurseryStep>0&&chosenEgg){const row=el('div',undefined,'selected-egg'),img=el('img');img.src=`${A}egg-${chosenEgg}.webp`;img.alt='';row.append(img,p('Your chosen egg is still here, watching everything.'));nodes.push(row)}
    clear(...nodes,list);
  }
  function monsterFinish(){const id=Object.keys(creatures).sort((a,b)=>(scores[b]||0)-(scores[a]||0))[0],data=creatures[id],picture=el('img');picture.src=`${A}creature-${id}.webp`;picture.alt=`Portrait of ${data[0]}`;picture.className='arcade-portrait';const input=el('input');input.className='arcade-field';input.maxLength=24;input.value=data[1];input.setAttribute('aria-label','Your monster’s name');const status=p('Give your new friend a name and keep your adoption here.','arcade-status');const keep=button('Adopt this little friend',()=>{const name=safeName(input.value).slice(0,24);if(!name){status.textContent='Your friend needs a name.';input.focus();return}const saved=get('kats-corner-monsters',[]);saved.push({species:id,name});status.textContent=save('kats-corner-monsters',saved.slice(-20))?`${name} is home! Adoption saved on this device.`:`${name} is yours for this visit; this browser could not save the adoption.`},'primary');clear(p('An egg has hatched!','eyebrow'),title(data[0]),picture,p(data[2]),p(`Special talent: ${data[3]}`),input,keep,status,button('Hatch another egg',monsterStart));}

  /* Quest 003: a real cottage drawing whose details follow the selected palette. */
  const homeOptions={
    walls:[['Sage','#a7c4a2'],['Velvet pink','#e7abc0'],['Periwinkle','#b5b5e6']],
    roof:[['Berry tiles','#965576'],['Moss roof','#557d56'],['Moon tiles','#647ca8']],
    sky:[['Bubble sunset','#e6a9b6'],['Soft morning','#add8db'],['Starlit evening','#343654']],
    garden:[['Flower garden','flowers'],['Mushroom patch','mushrooms'],['Herb garden','herbs']],
    friend:[['Fairy','fairy'],['Honey badger','badger'],['Tiny dragon','dragon']]
  };
  const homeAssetIds={walls:['sage','pink','lilac'],roof:['berry','moss','blue'],sky:['sunset','day','night'],garden:['flowers','mushrooms','herbs'],friend:['fairy','badger','dragon']};
  let draft={};
  function homeStart(){
    const previous=get('fae-fate-cottage',{});
    draft={walls:0,roof:0,sky:0,garden:0,friend:0,name:'Moss & Moon Cottage'};
    for(const key of Object.keys(homeOptions)){
      const value=previous[key],index=homeAssetIds[key].indexOf(value);
      if(index>=0)draft[key]=index;
      else if(Number.isInteger(value)&&value>=0&&value<3)draft[key]=value;
    }
    if(typeof previous.name==='string')draft.name=previous.name.slice(0,40);
    homeRender();
  }
  function homeRender(){
    const preview=el('div',undefined,'cottage-preview');
    const landscape=el('img'),cottage=el('img'),roommate=el('img');
    landscape.className='home-landscape';cottage.className='home-cottage';roommate.className='home-roommate';
    for(const picture of [landscape,cottage,roommate])picture.alt='';
    preview.append(landscape,cottage,roommate);
    const heading=title(draft.name.trim()||'Your cottage');
    const status=p('Choose your details, then save your home.','arcade-status');
    const name=el('input');name.className='arcade-field';name.maxLength=40;name.value=draft.name;name.id='cottage-name';name.setAttribute('aria-label','Cottage name');
    name.addEventListener('input',()=>{draft.name=name.value;heading.textContent=draft.name.trim()||'Your cottage';status.textContent='Cottage changes are not saved yet.'});
    const controls=el('div',undefined,'home-controls-new');
    for(const [key,options] of Object.entries(homeOptions)){
      const field=el('fieldset');field.append(el('legend',key==='friend'?'Tiny roommate':key==='sky'?'Time of day':key[0].toUpperCase()+key.slice(1)));
      for(let i=0;i<options.length;i++){
        const option=button(options[i][0],()=>{draft[key]=i;update();status.textContent='Cottage changes are not saved yet.'});
        option.setAttribute('aria-pressed',String(draft[key]===i));field.append(option);
      }
      controls.append(field);
    }
    function update(){
      const assetRoot=`${A}homes/`;
      landscape.src=`${assetRoot}background-${homeAssetIds.sky[draft.sky]}-${homeAssetIds.garden[draft.garden]}.webp`;
      cottage.src=`${assetRoot}${homeAssetIds.walls[draft.walls]}-${homeAssetIds.roof[draft.roof]}.webp`;
      roommate.src=`${assetRoot}roommate-${homeAssetIds.friend[draft.friend]}.webp`;
      preview.setAttribute('role','img');
      preview.setAttribute('aria-label',`${homeOptions.walls[draft.walls][0]} cottage with ${homeOptions.roof[draft.roof][0]}, ${homeOptions.garden[draft.garden][0]}, and a ${homeOptions.friend[draft.friend][0]}, at ${homeOptions.sky[draft.sky][0]}.`);
      controls.querySelectorAll('fieldset').forEach((group,j)=>group.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(draft[Object.keys(homeOptions)[j]]===i))));
    }
    const saveBtn=button('Save & throw a housewarming',()=>{
      draft.name=safeName(name.value);
      if(!draft.name){status.textContent='Your cottage needs a name first.';name.focus();return}
      heading.textContent=draft.name;
      status.textContent=save('fae-fate-cottage',draft)?'Cottage saved on this device. Your roommate has claimed the best chair.':'Your cottage is ready for this visit, but this browser could not save it.';
    },'primary');
    const surprise=button('Surprise me',()=>{for(const key of Object.keys(homeOptions))draft[key]=Math.floor(Math.random()*homeOptions[key].length);update();status.textContent='A new cottage is ready. Save it when it feels like home.'});
    clear(p('A tiny home of your own','eyebrow'),heading,preview,p('Pick a wall color, roof, sky, garden, and roommate. Every choice updates the cottage.'),controls,surprise,(() => {const label=el('label','Your cottage’s name');label.htmlFor='cottage-name';return label})(),name,saveBtn,status);
    update();
  }

  /* Quest 004: illustrated treasury with the original coin run and guard timer. */
  const goblinArt=Object.fromEntries(['treasury','player','coin','bonus','lantern'].map(part=>{const picture=new Image();picture.src=`${A}goblin-${part}.webp`;return [part,picture]}));
  const paint=(ctx,picture,x,y,w,h)=>{if(picture.complete&&picture.naturalWidth)ctx.drawImage(picture,x,y,w,h)};
  function stopGoblin(){if(goblin){cancelAnimationFrame(goblin.frame);goblin=null}}
  function goblinStart(){
    stopGoblin();
    const best=Number(get('kats-corner-goblin-best',0))||0;
    clear(p('Quest 004 · the kingdom treasury','eyebrow'),title('The treasury is unattended. Probably.'),p('Slide your mouse or finger left and right to catch falling coins. You have 30 seconds until the guard spots you. Arrow keys work too.'),p(`Best haul: ${best} coins`),action('Press / click to start',goblinPlay));
  }
  function goblinPlay(){
    stopGoblin();
    const hud=el('div',undefined,'goblin-hud'),scoreLabel=el('span','0 coins'),timeLabel=el('span','GUARD ARRIVES IN 30s');hud.append(scoreLabel,timeLabel);
    const field=el('div',undefined,'goblin-field');field.tabIndex=0;field.setAttribute('role','application');field.setAttribute('aria-label','Goblin Grab treasury. Slide mouse or finger, or hold left and right arrow keys, to move the goblin and basket.');
    const canvas=el('canvas');const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=640*ratio;canvas.height=440*ratio;
    const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);field.append(canvas);
    clear(hud,field,p('Mouse / touch: slide to catch coins · Keyboard: left and right arrows','arcade-caption goblin-help'));
    const run=goblin={ctx,field,frame:0,last:0,remaining:30,score:0,coins:[],spawn:0,x:320,left:false,right:false,scoreLabel,timeLabel};
    const move=event=>{const bounds=canvas.getBoundingClientRect();run.x=Math.max(45,Math.min(595,(event.clientX-bounds.left)/bounds.width*640))};
    field.addEventListener('pointermove',move);
    field.addEventListener('pointerdown',event=>{field.focus({preventScroll:true});move(event);field.setPointerCapture(event.pointerId)});
    field.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();run[event.key==='ArrowLeft'?'left':'right']=true}});
    field.addEventListener('keyup',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight')run[event.key==='ArrowLeft'?'left':'right']=false});
    field.addEventListener('blur',()=>{run.left=false;run.right=false});field.focus({preventScroll:true});
    function draw(){
      const {ctx,x,coins,remaining}=run;ctx.clearRect(0,0,640,440);
      ctx.fillStyle='#283a42';ctx.fillRect(0,0,640,440);
      paint(ctx,goblinArt.treasury,0,0,640,440);
      const approach=(30-remaining)/30,lanternSize=43+approach*95;
      ctx.fillStyle=`rgba(255,196,90,${.035+approach*.19})`;
      ctx.beginPath();ctx.arc(640-lanternSize*.44,265,52+approach*115,0,Math.PI*2);ctx.fill();
      paint(ctx,goblinArt.lantern,635-lanternSize*.76,265-lanternSize*.48,lanternSize*.76,lanternSize);
      for(const coin of coins){
        ctx.save();ctx.translate(coin.x,coin.y);ctx.scale(.7+Math.abs(Math.cos(coin.spin))*.3,1);
        paint(ctx,coin.bonus?goblinArt.bonus:goblinArt.coin,-20,-20,40,40);ctx.restore();
      }
      paint(ctx,goblinArt.player,x-59,294,118,126);
    }
    function finish(){
      if(goblin!==run)return;stopGoblin();const oldBest=Number(get('kats-corner-goblin-best',0))||0;
      if(run.score>oldBest)save('kats-corner-goblin-best',run.score);
      clear(p('The guard caught up','eyebrow'),title('The guard found you!'),p(`You escaped with ${run.score} coins. ${run.score>oldBest?'New best haul!':`Your best haul is ${oldBest} coins.`}`),p('The guard is certain the basket was already full when you arrived.'),action('Play again',goblinPlay));tone();
    }
    function frame(stamp){
      if(goblin!==run)return;
      const dt=run.last?Math.min((stamp-run.last)/1000,.05):0;run.last=stamp;
      if(!document.hidden && (window.katsTvPlayable?.() ?? true)){
        run.remaining=Math.max(0,run.remaining-dt);
        if(run.left)run.x=Math.max(45,run.x-390*dt);
        if(run.right)run.x=Math.min(595,run.x+390*dt);
        run.spawn+=dt;
        while(run.spawn>=.38){run.spawn-=.38;run.coins.push({x:27+Math.random()*586,y:-24,speed:145+Math.random()*95+(30-run.remaining)*2,bonus:Math.random()<.13,spin:Math.random()*6})}
        run.coins=run.coins.filter(coin=>{
          coin.y+=coin.speed*dt;coin.spin+=dt*5;
          if(coin.y>=354&&coin.y<=415&&Math.abs(coin.x-run.x)<48){run.score+=coin.bonus?3:1;run.scoreLabel.textContent=`${run.score} coins`;tone();return false}
          return coin.y<460;
        });
        run.timeLabel.textContent=`GUARD ARRIVES IN ${Math.ceil(run.remaining)}s`;
      }
      draw();if(run.remaining<=0){finish();return}run.frame=requestAnimationFrame(frame);
    }
    run.frame=requestAnimationFrame(frame);
  }

  /* Quest 005: three fixed visitors and clue-based recipes. */
  const ingredients=[['moon','Moonwater'],['mint','Cloudmint'],['spark','Star sugar'],['honey','Honeydrop'],['mushroom','Whispercap'],['rose','Rose dew']];
  const visitors=[['The village hatter','My hat keeps shouting the weather. Please give it something calming and sweet.',['mint','honey'],'The hat whispers “partly cloudy” and settles down for a nap.','The hat declares itself mayor. The village will hold an election.'],['A very small dragon','My fire has gone out. I need something bright and a little bit magical.',['spark','moon'],'A gentle blue flame returns. The dragon politely warms your tea.','The dragon sneezes glitter onto the ceiling.'],['The garden fairy','My flowers are sleepy. Something earthy and dewy might wake them up.',['mushroom','rose'],'The whole garden blooms. One daisy offers you a standing ovation.','The daisies start dancing. The fairy says she can work with this.']];
  let potionIndex=0,potionScore=0,selected=[];
  function potionStart(){potionIndex=0;potionScore=0;potionRoom()}
  function potionRoom(){if(potionIndex===3){const best=Math.max(potionScore,Number(get('kats-corner-potion-best',0))||0);save('kats-corner-potion-best',best);clear(p('Shift complete','eyebrow'),title(`${potionScore} / 3 remedies`),p(`Best shift: ${best} / 3. Every customer has survived the apothecary.`),action('Open shop again',potionStart));return}selected=[];const visitor=visitors[potionIndex],list=el('div',undefined,'arcade-choices'),status=p('Select exactly two ingredients.','arcade-status');const brew=button('Brew this potion',()=>{if(selected.length!==2){status.textContent='Choose two ingredients first.';return}const correct=visitor[2].every(id=>selected.includes(id));if(correct)potionScore++;clear(p(`Visitor ${potionIndex+1} / 3 · ${potionScore} successful`,'eyebrow'),title(correct?'A perfect remedy!':'An unexpected potion!'),p(correct?visitor[3]:visitor[4]),action(potionIndex===2?'Finish shift':'Next visitor',()=>{potionIndex++;potionRoom()}))},'primary');for(const [id,label] of ingredients){const choice=button(label,()=>{if(selected.includes(id))selected=selected.filter(item=>item!==id);else if(selected.length<2)selected.push(id);for(const child of list.children)child.setAttribute('aria-pressed',String(selected.includes(child.dataset.id)));status.textContent=`${selected.length} / 2 ingredients selected.`});choice.dataset.id=id;choice.setAttribute('aria-pressed','false');list.append(choice)}clear(p(`Visitor ${potionIndex+1} / 3 · ${potionScore} successful`,'eyebrow'),title(visitor[0]),p(visitor[1]),list,brew,status)}

  /* Quest 006: inspect, hint and accuse in each room. */
  const rooms=[['The midnight kitchen','The kettle is singing. One thing here is definitely alive.',[['Teapot','Its lid rises and falls like a breath. A tiny snore comes from the spout.',true],['Honey jar','Perfectly ordinary honey.'],['Silver spoon','Cold and polished.'],['Bread loaf','Freshly baked.'],['Candle','The wax stays still.']]],['The little library','The books remember every visitor. One object remembers them back.',[['Blue book','An eye in the margin blinks back at you.',true],['Quill pen','A normal feather.'],['Magnifying glass','It only enlarges the fine print.'],['Plush dragon','Stuffed with cotton.'],['Hourglass','Sand falls at the usual speed.']]],['The attic of oddities','Dust, old costumes, and a suspicious rustle.',[['Velvet hat','Tiny teeth hide beneath its brim. It whispers “nice hair.”',true],['Travel case','Only old postcards and a sock.'],['Portrait','Dry paint; the eyes do not move.'],['Yarn ball','The floor is slanted.'],['Mirror','Only your reflection looks back.']]]];
  let roomIndex=0,mimicScore=0,inspected=new Set();
  function mimicStart(){roomIndex=0;mimicScore=0;mimicRoom()}
  function mimicRoom(){if(roomIndex===3){clear(p('Case closed','eyebrow'),title(`${mimicScore} / 3 mimics found`),p('The household objects promise to behave. The hats declined to sign.'),action('Investigate again',mimicStart));return}inspected=new Set();const room=rooms[roomIndex],clue=p('Inspect an object for a clue, then accuse one.','arcade-status'),list=el('div',undefined,'arcade-choices');for(const [name,description,isMimic] of room[2]){const row=el('div',undefined,'mimic-row');const inspect=button(`Inspect ${name}`,()=>{inspected.add(name);clue.textContent=`${name}: ${description}`});const accuse=button(`Accuse ${name}`,()=>{if(isMimic)mimicScore++;clear(p(`Room ${roomIndex+1} / 3 · ${mimicScore} caught`,'eyebrow'),title(isMimic?'Mimic found!':'Just furniture this time.'),p(isMimic?`${name} sprouts little legs and scuttles away.`:`The ${name.toLowerCase()} is innocent. The real mimic escapes this room.`),action(roomIndex===2?'Finish investigation':'Next room',()=>{roomIndex++;mimicRoom()}))});row.append(inspect,accuse);list.append(row)}clear(p(`Room ${roomIndex+1} / 3 · ${mimicScore} caught`,'eyebrow'),title(room[0]),p(room[1]),list,button('Ask Gerald for a hint',()=>{const culprit=room[2].find(item=>item[2]);clue.textContent=`Gerald Note: Inspect the ${culprit[0].toLowerCase()}. It is doing something objects usually cannot do.`}),clue)}

  /* Quest 007: deterministic silly corrections, saved recent journal. */
  const pages=[['At the castle gate','The guard looks bored. Summon ____ to help with the watch.','Summon','The guard offers the new recruits tiny uniforms.'],['In the village square','The rain is coming. Raise a wall of ____ around the picnic.','Raise a wall of','The village council wants to discuss the wall.'],['At the royal ball','Make it rain ____ from the chandelier.','Make it rain','The royal photographer calls it a once-in-a-lifetime opportunity.']];
  const replacements=['glitter','friendly geese','tiny dragons','top hats','bubbles','whispering mushrooms','pink bow ties','sleepy honey badgers','singing teacups','dancing potatoes'];
  let pageIndex=0;
  function spellStart(){pageIndex=0;spellPage()}
  function spellPage(){if(pageIndex===3){clear(p('Spellbook closed','eyebrow'),title('The spellbook requests a promotion.'),p('You survived three helpful corrections. The castle, village and royal ball are discussing the consequences.'),action('Cast three more spells',spellStart));journal();return}const page=pages[pageIndex],form=el('form'),label=el('label','Your missing word'),input=el('input');input.className='arcade-field';input.required=true;input.maxLength=24;input.autocomplete='off';input.placeholder='Try dragon, cake, Gerald…';const cast=el('button','Cast this spell','primary');cast.type='submit';form.append(label,input,cast);form.addEventListener('submit',event=>{event.preventDefault();const word=input.value.trim().slice(0,24);if(!word)return;let hash=pageIndex*13;for(const char of word.toLowerCase())hash=(hash*31+char.codePointAt(0))>>>0;let correction=word.toLowerCase().includes('gerald')?'pink bow ties':replacements[hash%replacements.length];if(correction.toLowerCase()===word.toLowerCase())correction=replacements[(hash+1)%replacements.length];const entries=get('kats-corner-spellbook-miscasts-v1',[]);entries.unshift({page:pageIndex,original:word,replacement:correction});save('kats-corner-spellbook-miscasts-v1',entries.slice(0,6));clear(p(`Page ${pageIndex+1} / 3`,'eyebrow'),title('The book made a correction.'),p(`You wrote: “${page[2]} ${word}.”`),p(`The book wrote: “${page[2]} ${correction}.” ${page[3]}`),action(pageIndex===2?'Close the book':'Turn the page',()=>{pageIndex++;spellPage()}));journal();tone()});clear(p(`Page ${pageIndex+1} / 3`,'eyebrow'),title(page[0]),p(page[1]),form);journal()}
  function journal(){const entries=get('kats-corner-spellbook-miscasts-v1',[]),wrapper=el('div',undefined,'spell-journal');wrapper.append(el('h4','Recent miscasts'));const list=el('ol');for(const entry of entries.slice(0,6))if(entry&&typeof entry.original==='string'&&typeof entry.replacement==='string'&&pages[entry.page])list.append(el('li',`“${entry.original.slice(0,24)}” → “${entry.replacement.slice(0,32)}” · ${pages[entry.page][0]}`));if(!list.childElementCount)wrapper.append(p('The margins are suspiciously clean.'));else wrapper.append(list);box.append(wrapper)}
  if(games.some(g=>location.hash===`#${g.id}`))window.renderArcadeGame(location.hash.slice(1));
})();
