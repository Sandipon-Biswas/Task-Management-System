import { useState } from 'react';
import { getProgress, getReport, downloadPDF, downloadCSV } from '../api.js';

const ProgressReport = () => {
  const [progress, setProgress] = useState(0);
  const [reportType, setReportType] = useState('user');
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await getProgress();
      setProgress(data.progress);
    };
    fetchProgress();
  }, []);

  const handleGetReport = async () => {
    const { data } = await getReport(reportType, id);
    // Display data
  };

  const handleDownloadPDF = async () => {
    const { data } = await downloadPDF(reportType, id);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  // Similar for CSV

  return (
    <div>
      <h2>Your Progress: {progress}%</h2>
      <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
        <option value="user">User</option>
        <option value="project">Project</option>
      </select>
      <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
      <button onClick={handleGetReport}>Get Report</button>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={handleDownloadCSV}>Download CSV</button>
    </div>
  );
};

export default ProgressReport;