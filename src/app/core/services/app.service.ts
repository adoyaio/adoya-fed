import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppService {
  static termsOfService: string = `
  <div class='text-center'><h4>Adoya Client Portal Terms of Use</h4></div>
  <div class='p-2 p-md-4'>These Terms of Service (these &ldquo;Terms&rdquo;) contain the terms and conditions that govern your access to and use of one or more (the &ldquo;Services&rdquo;) and is entered into by and between you and</div>
  <div>PLEASE READ THIS DOCUMENT CAREFULLY. BY CLICKING TO AGREE TO THESE TERMS WHEN THIS OPTION IS MADE AVAILABLE TO YOU, YOU ACCEPT AND AGREE TO BE BOUND AND ABIDE BY THE TERMS CONTAINED HEREIN AND THE ADOYA TERMS OF USE- <a href='https://www.adoya.io/' target='_blank'>https://www.adoya.io/</a>, WHICH ARE INCORPORATD HEREIN BY REFERENCE.  IF YOU DO NOT AGREE TO BE BOUND BY ANY OF THESE TERMS, YOU MAY NOT USE THE SERVICES.</div>
  <div>
  <ol start='1'>
  <li><u>Lorem Ipsum</u>.<br/><br/><ol type='a'><li>consectetur adipiscing elit</li></ol><ol type='b'><li>consectetur adipiscing elit</li></ol></li>
  </ol>
  <ol start='2'>
  <li><u>Lorem Ipsum</u>.<br/><br/><ol type='a'><li>consectetur adipiscing elit</li></ol><ol type='b'><li>consectetur adipiscing elit</li></ol></li>
  </ol>
  <ol start='3'>
  <li><u>Lorem Ipsum</u>.<br/><br/><ol type='a'><li>consectetur adipiscing elit</li></ol><ol type='b'><li>consectetur adipiscing elit</li></ol></li>
  </ol>
  <ol start='4'>
  <li><u>Lorem Ipsum</u>.<br/><br/><ol type='a'><li>consectetur adipiscing elit</li></ol><ol type='b'><li>consectetur adipiscing elit</li></ol></li>
  </ol>
  <ol start='5'>
  <li><u>Lorem Ipsum</u>.<br/><br/><ol type='a'><li>consectetur adipiscing elit</li></ol><ol type='b'><li>consectetur adipiscing elit</li></ol></li>
  </ol>
  </div>
  `;
  downloadAggregateFile(data, filename) {
    let headerRow = [
      "date",
      "cost",
      "installs",
      "cost per install",
      "purchases",
      "revenue",
      "cost per purchase",
      "return on ad spend",
    ];
    let csvData = this.ConvertToCSV(
      data,
      [
        "timestamp",
        "spend",
        "installs",
        "cpi",
        "purchases",
        "revenue",
        "cpp",
        "revenueOverCost",
      ],
      headerRow
    );
    let blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    // if (isSafariBrowser) {
    //   // if Safari open in new window to save file with random filename.
    //   dwldLink.setAttribute("target", "_blank");
    // }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadKeywordFile(data, filename) {
    let headerRow = [
      "date",
      "keyword id",
      "keyword",
      "match type",
      "status",
      "display status",
      "cost",
      "installs",
      "cost per install",
    ];
    let csvData = this.ConvertToCSV(
      data,
      [
        "date",
        "keyword_id",
        "keyword",
        "matchType",
        "keywordStatus",
        "keywordDisplayStatus",
        "local_spend",
        "installs",
        "avg_cpa",
      ],
      headerRow
    );
    let blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList, headerRow) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";

    for (let index in headerRow) {
      row += headerRow[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      //let line = i + 1 + "";
      let line = "";
      for (let index in headerList) {
        let head = headerList[index];
        // line += "," + array[i][head];
        line += array[i][head] + ",";
      }
      str += line + "\r\n";
    }
    return str;
  }
}
