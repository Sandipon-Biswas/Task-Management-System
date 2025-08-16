import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';

// Get Progress Report (JSON)
export const getProgressReport = async (req, res) => {
  const { type, id } = req.query; // type: 'project' or 'user', id: projectId or userId
  let report;

  if (type === 'project') {
    const project = await Project.findById(id).populate('tasks');
    const completed = project.tasks.filter(t => t.status === 'completed').length;
    report = { progress: (completed / project.tasks.length) * 100 || 0, tasks: project.tasks };
  } else if (type === 'user') {
    const user = await User.findById(id).populate('tasks');
    const completed = user.tasks.filter(t => t.status === 'completed').length;
    report = { progress: (completed / user.tasks.length) * 100 || 0, tasks: user.tasks };
  }

  res.json(report);
};

// Generate PDF Report
export const generatePDFReport = async (req, res) => {
  const { type, id } = req.query;
  let data = await getReportData(type, id);

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  doc.pipe(res);

  doc.fontSize(25).text('Progress Report\n');
  doc.fontSize(14).text(`Type: ${type}`);
  doc.text(`ID: ${id}`);
  doc.text(`Progress: ${data.progress.toFixed(2)}%\n`);

  // Task list
  doc.text('Tasks:\n');
  data.tasks.forEach((t, i) => {
    doc.text(`${i + 1}. ${t.title} - ${t.status}`);
  });

  doc.end();
};

// Generate CSV Report
export const generateCSVReport = async (req, res) => {
  const { type, id } = req.query;
  let data = await getReportData(type, id);

  const csvWriter = createObjectCsvWriter({
    path: 'report.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'status', title: 'Status' }
    ]
  });

  await csvWriter.writeRecords(
    data.tasks.map(t => ({ title: t.title, status: t.status }))
  );

  res.download('report.csv');
};

// Helper Function
async function getReportData(type, id) {
  let report;
  if (type === 'project') {
    const project = await Project.findById(id).populate('tasks');
    const completed = project.tasks.filter(t => t.status === 'completed').length;
    report = { progress: (completed / project.tasks.length) * 100 || 0, tasks: project.tasks };
  } else if (type === 'user') {
    const user = await User.findById(id).populate('tasks');
    const completed = user.tasks.filter(t => t.status === 'completed').length;
    report = { progress: (completed / user.tasks.length) * 100 || 0, tasks: user.tasks };
  }
  return report;
}
