self.importScripts('deps.js');

console.log('Worker core...');

self.addEventListener('message', (event) => {
  if (!event.data) {
    throw TypeError('Event must have data property!');
  }
  
  console.log('(message) event:', event.data);
  
  if (event.data.action === 'download') {
    download(event.data.payload);
  }
});

function download(data) {
  const conditions = undefined;
  
  const doc = new WorkerExport.jsPDF()
  let outDataSource = new WorkerExport.ArrayStore(data)
  
  outDataSource
    .load({ filter: conditions })
    .done((filteredData => {
      doc.autoTable({
        body: WorkerExport.processing.getDetails(filteredData),
        columns: WorkerExport.processing.columns,
      })
    }))
    .catch(console.error);
  
  self.postMessage({
    message: 'start-response',
    // WebWorker doesn't have access to DOM, so the save process (which under the hood uses some Canvas magic via file-saver lib) must be done in main thread
    payload: doc.output('blob'),
  });
}