(() => {
  const button=document.getElementById('alex-shutter');
  const note=document.getElementById('alex-photo-note');
  const captions=[
    'The cat is already in the frame.',
    'Take two. The cat has moved to the center.',
    'A carefully composed photograph. The cat is in the corner again.',
    'Alex keeps the print. The cat considers this a victory.'
  ];
  let frame=0;
  button.addEventListener('click',()=>{frame=(frame+1)%captions.length;note.textContent=captions[frame]});
})();
