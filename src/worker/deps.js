import ArrayStore from 'devextreme/data/array_store'
import processing from '../processing'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

console.log('Worker deps...', ArrayStore, jsPDF);

// here you expose values imported above, so the worker/core.js script can access them
self.WorkerExport = {
  ArrayStore, jsPDF, processing,
};