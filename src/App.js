import logo from './logo.svg'
import './App.css'

import { useWorker } from "@koale/useworker"
import ArrayStore from 'devextreme/data/array_store'
import { Button } from 'reactstrap'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

import dataExample from './data'
import processing from './processing'

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
      localDependencies: () => ['jspdf', 'jspdf-autotable', 'devextreme/data/array_store']
    }
  )

  const exportPdfWorkerHandler = (e) => {
    const conditions = undefined
    const fcn = async () => {
      await exportPdfWorker(dataExample, conditions)
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
      }))
    doc.save('nazwa.pdf')
    e.cancel = true
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button color='primary' onClick={e => exportPdfWorkerHandler(e)}>WORKER: Export to pdf</Button>
        <Button color='primary' onClick={e => onExportPdf(e)}>NO-WORKER: Export to pdf</Button>
      </header>
    </div>
  )
}

export default App
