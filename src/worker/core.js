self.importScripts('deps.js');

console.log('Worker core...');

self.addEventListener('message', (event) => {
  if (!event.data) {
    throw TypeError('Event must have data property!');
  }
  
  console.log('(message) event:', event.data);
  
  if (event.data.action === 'start') {
    start(event.data.payload);
  }
});

function start(data) {
  const conditions = {};
  
  const doc = new WorkerExport.jsPDF()
  let outDataSource = new WorkerExport.ArrayStore(data)
  
  const loadRes = outDataSource
    .load({ filter: conditions });
  console.log('loadRes:', loadRes);
    loadRes
    .done((filteredData => {
      console.log('---')
      
      doc.autoTable({
        body: WorkerExport.processing.getDetails(filteredData),
        columns: WorkerExport.processing.columns,
      })
      console.log('done out:', doc.output());
    }));
    loadRes.catch(console.error)
  self.postMessage({
    message: 'start-response',
    payload: doc.output('blob'),
  });
  // doc.save('nazwa.pdf')
}