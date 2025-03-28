import * as ExcelJs from "exceljs";

export function parseExcel(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const book = new ExcelJs.Workbook();
      book.xlsx.load(reader.result).then((wrokbook) => {
        const bookData = [];
        wrokbook.eachSheet((sheet) => {
          const page = [];
          sheet.eachRow((row) => {
            const rowData = [];
            row.eachCell((cell) => {
              let v = cell.value;
              if (v === undefined || v === null) {
                v = "";
              }
              rowData.push(v);
            });
            page.push(rowData);
          });
          bookData.push({title: sheet.name, data: page});
        });
        resolve(bookData);
      });
    };
  });
}

export const createExcel = (bookData, fileName) => {
  const workbook = new ExcelJs.Workbook();
  workbook.creator = "深圳水务科技";
  workbook.lastModifiedBy = "深圳水务科技";
  bookData.forEach((sheet) => {
    const worksheet = workbook.addWorksheet(sheet.title);
    sheet.data.forEach((rows) => {
      worksheet.addRow(rows);
    });
  });
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      downloadFile(buffer, fileName + new Date().getTime() + ".xlsx");
    })
    .catch((err) => {
      console.log("excel export error", err);
    });
};

export const uploadFile = (accept) => {
  return new Promise((resolve) => {
    const upload = document.createElement("input");
    upload.style.position = "fixed";
    upload.style.opacity = "0";
    upload.accept = accept;
    upload.type = "file";
    upload.onchange = () => {
      if (upload.files?.length) {
        resolve(upload.files[0]);
      }
      document.body.removeChild(upload);
    };
    document.body.appendChild(upload);
    upload.click();
  });
};
export const downloadFile = (buffer, filename) => {
  const url = URL.createObjectURL(new File([buffer], filename));
  const a = document.createElement("a");
  a.style = "display: none";
  a.download = filename;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
