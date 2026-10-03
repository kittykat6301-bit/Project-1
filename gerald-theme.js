(() => {
  const button=document.getElementById('archive-stamp');
  const report=document.getElementById('archive-report');
  const reports=[
    'All files accounted for. I find this suspicious.',
    'INCIDENT 249: A paperclip fell. Gerald has called a meeting.',
    'STATUS: Kat built the original arcade. Gerald is labeling its shelves.',
    'SUSPECT: Derek. EVIDENCE: vibes. CASE: pending.',
    'ARCHIVE BOT NOTICE: Gerald has reorganized the same shelf six times.',
    'ORIGINAL KAT TEXT: “needs fixy.” Technical terminology accepted.'
  ];
  let index=0;
  button.addEventListener('click',()=>{index=(index+1)%reports.length;report.textContent=reports[index]});
})();
