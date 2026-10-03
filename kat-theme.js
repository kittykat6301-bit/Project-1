(() => {
  const lines=['Bookwyrm says it has no idea. The bookmark is sticking out of its mouth.','Found it under the manuscript. How did the Bookwyrm move a whole manuscript?','Tiny Gerald filed it under “things Kat was definitely about to need.”','It was in the notebook all along. We will not speak of this again.'];
  let line=0;
  document.getElementById('kat-note-button').addEventListener('click',()=>{line=(line+1)%lines.length;document.getElementById('kat-note').textContent=lines[line]});
})();
