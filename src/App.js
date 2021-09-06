import logo from './logo.svg'
import './App.css'

import { useWorker } from "@koale/useworker"
import ArrayStore from 'devextreme/data/array_store'
import { Button } from 'reactstrap'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver';
import dataExample from './data'
import processing from './processing'

window._saveAs = saveAs;

function App() {
  const [exportPdfWorker] = useWorker(
    (data, conditions) => {
      const doc = new jsPDF()
      let outDataSource = new ArrayStore(data)
      outDataSource
        .load({ filter: conditions })
        .done((filteredData => {
          doc.autoTable({
            body: processing.getDetails(filteredData),
            columns: processing.columns,
          })
        }))
      doc.save('nazwa.pdf')
    },
    {
      // localDependencies: () => [jsPDF, /*jspdf, jspdf-autotable, ArrayStore*//*, devextreme/data/array_store*/]
      dependencies: () => [jsPDF, /*jspdf, jspdf-autotable, ArrayStore*//*, devextreme/data/array_store*/]
    }
  )

  const exportPdfWorkerHandler = (e) => {
    const conditions = undefined
    const fcn = async () => {
      await exportPdfWorker(dataExample, conditions).catch(console.error)
    }
    fcn()
    e.cancel = true
  }

  const onExportPdf = (e) => {
    const conditions = undefined
    const doc = new jsPDF()
    let outDataSource = new ArrayStore(dataExample)
    const loadRes = outDataSource
      .load({ filter: conditions });
    console.log('loadres:',loadRes);
    loadRes
      .done((filteredData => {
        console.warn('wtf')
        
        doc.autoTable({
          body: processing.getDetails(filteredData),
          columns: processing.columns,
        })
      })).catch(console.error)
    console.warn('?')
    
    // doc.save('nazwa.pdf')
    // console.log('??????raw output:', doc.output());
    saveAs(doc.output('blob'), 'test-666.pdf');
    
    e.cancel = true
  }


  const delegateToWorker = () => {
    console.log('dataexample???', dataExample)
    
    const worker = new Worker('http://localhost:3000/worker/core.js');
    worker.addEventListener('message', (event) => {
      console.log('received payload from worker:', event.data.payload);
      
      saveAs(event.data.payload, 'test.pdf');
    });
    worker.postMessage({action: 'start', payload: dataExample})
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button color='primary' onClick={e => exportPdfWorkerHandler(e)}>WORKER: Export to pdf</Button>
        <Button color='primary' onClick={e => onExportPdf(e)}>NO-WORKER: Export to pdf</Button>
        <Button color='primary' onClick={delegateToWorker}>OK-WORKER: Export to pdf</Button>
      </header>
    </div>
  )
}

export default App
