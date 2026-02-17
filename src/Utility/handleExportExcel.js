
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const handleExportExcel = (fileName,columnConfig,data) => {
  const headers = columnConfig.map(col => col.header);
  const rows = data.map(item => columnConfig.map(col => item[col.key]));

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Checklist");

  const today = new Date().toISOString().split("T")[0];
  const finalFileName = `${fileName}_${today}.xlsx`;

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, finalFileName);
};



export default handleExportExcel;