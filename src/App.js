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
import {useRef, useEffect} from 'react'

class WorkerHandler {
  constructor() {
    this.worker = null
  }
  
  setup() {
    this.worker = new Worker('http://localhost:3000/worker/core.js');
    this.worker.addEventListener('message', (event) => {
      console.log('received payload from worker:', event.data.payload);
    
      saveAs(event.data.payload, 'test.pdf');
    });
  }
  requestPDFDownload() {
    if (!this.worker) {
      this.setup();
    }
  
    this.worker.postMessage({ action: 'download', payload: dataExample })
  }
}

function App() {
  const workerHandler = useRef(null);
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
      localDependencies: () => ['jspdf', 'jspdf-autotable', 'devextreme/data/array_store']
    }
  )

  useEffect(() => {
    workerHandler.current = new WorkerHandler();
  }, []);
  
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
    
    outDataSource
      .load({ filter: conditions })
      .done((filteredData => {
        doc.autoTable({
          body: processing.getDetails(filteredData),
          columns: processing.columns,
        })
      }));
    
    doc.save('nazwa.pdf')
    e.cancel = true
  }


  const delegateToWorker = () => {
    console.log('dataexample???', dataExample)
  
    workerHandler.current.requestPDFDownload(dataExample);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button color='primary' onClick={e => exportPdfWorkerHandler(e)}>WORKER: Export to pdf</Button>
        <Button color='primary' onClick={e => onExportPdf(e)}>NO-WORKER: Export to pdf</Button>
        <Button color='success' onClick={delegateToWorker}>Proper-WORKER: Export to pdf</Button>
      </header>
    </div>
  )
}

export default App
