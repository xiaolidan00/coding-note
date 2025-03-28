export function parseExcel(file) {
  return new Promise((resolve) => {
    import("exceljs").then((ExcelJs) => {
      if (!ExcelJs) return;
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
  });
}

export const createExcel = (bookData, fileName) => {
  import("exceljs").then((ExcelJs) => {
    if (!ExcelJs) return;
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
  });
};
