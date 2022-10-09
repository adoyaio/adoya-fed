import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppService {
  static termsOfService: string = `
  <div class='text-center'><h4>Adoya, Inc. Terms of Service</h4></div>

  <div class="mb-2">
  www.adoya-app.io and www.adoya.io is operated by Adoya, Inc. <br> Throughout these “Terms of Use” we use the terms “we”, “us”, “our”, or the “Company” to refer to Adoya, Inc. We refer to any person accessing or using this website as “You,” or the “User.”
  The following outlines the Terms of Use, together with any other legal agreements by and between you and the Company linked within the Terms of Use (collectively the “Agreement”), govern your access to and use of the website, services, features, content, and any applications offered by the Company and found at www.adoya-app.io/portal and/or www.adoya.io (collectively the "Platforms”) whether as a guest or a registered user. Before using any of our services, you are required to read, understand, and agree to these terms.
  </div>

  <div><u><h4>ACCEPTANCE OF THE TERMS OF USE:</h4></u></div>
  <div class="mb-2">Please read these Terms of Use carefully before you start to use the Platforms. By using the Platforms, or by clicking to accept or agree to the user agreement (including these Terms of Use) when this option is made available to you, you accept and agree to be bound and abide by these Terms of Use and our Privacy Policy, incorporated herein by reference. If you do not want to agree to these Terms of Use or the Privacy Policy, you must not access or use the Platforms.
  The Platforms are offered and available to users who are 18 years of age or older and reside in the United States or any of its territories or possessions. By using these Platforms, you represent and warrant that you are of legal age to form a binding contract with the Company and meet all of the foregoing eligibility requirements. If you do not meet all of these requirements, you must not access or use the Platforms.
  </div>

  <div><u><h4>ACCESSING THE PLATFORMS AND ACCOUNT SECURITY:</h4></u></div>
  <div class="mb-2">
  <div class="mb-2">We reserve the right to withdraw or amend these Platforms, and any service or material we provide on the Platforms, in our sole discretion without notice. We will not be liable if, for any reason, all or any part of the Platforms are unavailable at any time or for any period.</div>
  <div class="mb-2">From time to time, we may restrict access to some parts of the Platforms, or the entirety of the Platforms, to users, including registered users. You are responsible for making all arrangements necessary for you to have access to the information hosted on the Platforms and ensuring that all persons who access the Platforms through your Internet connection are aware of these Terms of Use and comply with them.</div>
  <div class="mb-2">To access the Platforms, or some of the resources they offer, you may be asked to provide certain registration details or other information. Details requested include, but are not limited to, first and last name, email address, and credit card information (when applicable). It is a condition of your use of the Platforms that all the information you provide on the Platforms is correct, current, truthful, and complete. You agree that all information you provide to register with these Platforms or otherwise, including but not limited to through the use of any interactive features on the Platforms, is governed by our Privacy Policy https://www.adoya.io/privacy and you consent to all actions we take with respect to your information consistent with our Privacy Policy.</div>
  <div class="mb-2">If you choose, or are provided with, a username, password or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. You also acknowledge that your account is personal to you and agree not to provide any other person with access to these Platforms, or portions of it, using your username, password or other security information. You agree to notify us immediately of any unauthorized access to or use of your username or password or any other breach of security. You understand and agree that, if you are logged into your user account, you will ensure that you exit/log out from your account at the end of each session, in order to keep your information secure. You should use particular caution when accessing your account from a public or shared computer so that others are not able to view or record your password or other personal information.</div>
  <div class="mb-2">We reserve the right to disable any username, password or other identifier, whether chosen by you or provided by us, at any time, in our sole discretion, for any or no reason, including if, in our opinion, you have violated any provision of these Terms of Use.</p>
  </div>

  <div><u><h4>INTELLECTUAL PROPERTY RIGHTS:</h4></u></div>
  <div class="mb-2">
  <div>The Platforms and their entire contents, features and functionality, including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof (collectively the “Content”), are owned by the Company, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.</div>
  <div>These Terms of Use grant you a limited, revocable, non-transferable, and non-exclusive license to use the Platforms for your personal use only. <strong>You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Platforms, except as follows:</strong></div>
  <ul>
      <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
      <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
      <li>You may print or download one copy of a reasonable number of pages of the Platforms for your own personal, non-commercial use and not for further reproduction, publication or distribution.</li>
      <li>If we provide social media features in connection with certain Content, you may take such actions as are enabled by such features.</li>
  </ul>
  <p><strong>You must <u>not:</u></strong></p>
  <ul>
      <li>Modify copies of any materials from these Platforms.</li>
      <li>Use any illustrations, photographs, video or audio sequences or any graphics separately from the
      accompanying text.</li>
      <li>Delete or alter any copyright, trademark or other proprietary rights notices from copies of materials
      from these Platforms.</li>
      <li>Decompile, reverse engineer, reverse assemble, decipher or otherwise attempt to discover any
      programming code or any source code used in or with the Content, or otherwise distribute in any way the Content other than as specifically permitted in this Agreement.</li>
  </ul>
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

  downloadCampaignFile(data, filename) {
    let headerRow = [
      "date",
      "campaign id",
      "campaign",
      "cost",
      "installs",
      "cost per install",
      "revenue",
      "purchases",
    ];
    let csvData = this.ConvertToCSV(
      data,
      [
        "timestamp",
        "campaign_id",
        "campaignName",
        "local_spend",
        "installs",
        "avg_cpa",
        "branch_revenue",
        "branch_commerce_event_count",
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
