/* Phase 14–15: gallery filters and local share cards. */
(() => {
  const gallery=document.getElementById('mascot-grid'),status=document.getElementById('mascot-filter-status');let filter='all';
  function showBuddies(){
    const room=document.documentElement.dataset.theme||'classic';let visible=0;
    for(const card of gallery.children){const show=filter==='all'||(filter==='adopted'?card.classList.contains('saved-monster'):card.dataset.room===room);card.hidden=!show;if(show)visible++}
    status.textContent=filter==='all'?`${visible} buddies in the gallery.`:filter==='adopted'?`${visible} adopted ${visible===1?'friend':'friends'} saved in this browser.`:visible?`${visible} buddy for this room.`:'No buddy is assigned to this room yet.';
  }
  document.querySelectorAll('[data-buddy-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.buddyFilter;document.querySelectorAll('[data-buddy-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));showBuddies()}));
  document.addEventListener('kats-theme-change',showBuddies);addEventListener('hashchange',()=>{if(location.hash==='#mascots')showBuddies()});showBuddies();
  function downloadCard(title,detail,filename){
    const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const ctx=canvas.getContext('2d');if(!ctx)return;
    const gradient=ctx.createLinearGradient(0,0,960,540);gradient.addColorStop(0,'#1c2949');gradient.addColorStop(1,'#5e294f');ctx.fillStyle=gradient;ctx.fillRect(0,0,960,540);
    ctx.strokeStyle='#ffd5e6';ctx.lineWidth=6;ctx.strokeRect(28,28,904,484);ctx.strokeStyle='#9ee2db';ctx.lineWidth=2;ctx.strokeRect(42,42,876,456);
    ctx.fillStyle='#f7c9dd';ctx.font='bold 28px system-ui';ctx.fillText('✿  KAT’S CORNER',82,110);
    ctx.fillStyle='#9ee2db';ctx.font='bold 19px system-ui';ctx.fillText('A LITTLE ARCADE KAT MADE',82,148);
    function lines(value,y,size,maxLines){ctx.font=`bold ${size}px system-ui`;ctx.fillStyle='#fff8ed';const words=String(value).split(/\s+/);let line='',used=0;for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>785&&line){ctx.fillText(line,82,y+used*(size+12));used++;line=word;if(used>=maxLines)return}else line=test}if(line&&used<maxLines)ctx.fillText(line,82,y+used*(size+12))}
    lines(title,250,52,2);lines(detail,390,27,2);
    ctx.fillStyle='#f7c9dd';ctx.font='20px system-ui';ctx.fillText('Saved on this device · kats-corner.kittykat6301.chatgpt.site',82,475);
    const link=document.createElement('a');link.href=canvas.toDataURL('image/png');link.download=filename;link.click();
  }
  document.getElementById('achievement-grid').addEventListener('click',event=>{const button=event.target.closest('.badge-share');if(!button)return;const card=button.closest('.restoration-card');downloadCard(card.querySelector('h3').textContent,'ACHIEVEMENT EARNED','kats-corner-achievement.png')});
  document.getElementById('score-share').addEventListener('click',()=>{const values=[...document.querySelectorAll('#shelf-scores div')].map(node=>node.textContent.trim());downloadCard('My arcade scores',values.join('   ·   '),'kats-corner-scores.png')});
  window.katsRefreshBuddies=showBuddies;
})();
