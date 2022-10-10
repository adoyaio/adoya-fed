import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppService {
  static termsOfService: string = `
  <div class='text-center'><h4>Adoya, Inc. Terms of Service</h4></div>

  <div class="mb-2">
  www.adoya-app.io and www.adoya.io is operated by Adoya, Inc. <br> <br> Throughout these “Terms of Use” we use the terms “we”, “us”, “our”, or the “Company” to refer to Adoya, Inc. We refer to any person accessing or using this website as “You,” or the “User.”
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
  <div class="mb-2">
  You must not access or use for any commercial purposes any part of the Platforms or any services or materials available through the Platforms unless you are a paying user of the Platforms, and in such case, only in accordance with the terms of your user agreement with the Company.
  </div>
  <div class="mb-2">
  If you wish to make any use of material on the Platforms other than that set out in this section, please address your request to: info@adoya.io.
  </div>
  <div class="mb-2">
  If you print, copy, modify, download or otherwise use or provide any other person with access to any part of the Platforms in breach of the Terms of Use, your right to use the Platforms will cease immediately and you must, at our option, return or destroy any copies of the materials you have made. No right, title or interest in or to the Platforms or any Content on the Platforms is transferred to you, and all rights not expressly granted are reserved by us. Any use of the Platforms not expressly permitted by these Terms of Use is a breach of these Terms of Use and may violate copyright, trademark and other laws.
  </div>

  <div class="mb-2 mt-2"><u><h4>EMAIL CORRESPONDENCE:</h4></u></div>

  <div class="mb-3">
  Emails sent to any @adoya.io email address are considered our property. You can read more about this in our Privacy Policy https://www.adoya.io/privacy. If you wish to remain anonymous, please specify this in the body of the email itself and we will do our best to respect your wishes.
  </div>

  <div class="mb-2 mt-2"><u><h4>TRADEMARKS:</h4></u></div>

  <div class="mb-3">
  The Company name, the Company logo and all related names, logos, product and service names, designs and slogans are trademarks of the Company or its affiliates or licensors. You must not use such marks without the prior written permission of the Company, except in a manner constituting “fair use.” All other names, logos, product and service names, designs and slogans on these Platforms are the trademarks of their respective owners.
  </div>

  <div class="mb-2 mt-2"><u><h4>PROHIBITED USES:</h4></u></div>

  <div class="mb-3 ">
  You may use the Platforms and our services only for lawful purposes and in accordance with these Terms of Use. You agree not to use the Platforms and/or our services:
  <ul>
  <li>In any way that violates any applicable federal, state, local or international law or regulation (including, without limitation, any laws regarding the export of data or software to and from the US or other countries).</li>
  <li>To transmit, or procure the sending of, any advertising or promotional material, without our prior written consent, including any "junk mail", "chain letter" or "spam" or any other similar solicitation.</li>
  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user or any other person or entity (including, without limitation, by using e-mail addresses or screen names associated with any of the foregoing).</li>
  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Platforms, or which, as determined by us, may harm the Company or users of the Platforms or expose them to liability.</li>
  </ul>
  </div>

  <div class="mb-3">
  Additionally, you agree not to:
  <ul>
  <li>Use the Platforms in any manner that could disable, overburden, damage, or impair the Platforms or interfere with any other party's use of the Platforms, including their ability to engage in real time activities through the Platforms.</li>
  <li>Use any robot, spider or other automatic device, process or means to access the Platforms for any purpose, including monitoring or copying any of the material on the Platforms.</li>
  <li>Use any manual process to monitor or copy any of the material on the Platforms or for any other unauthorized purpose without our prior written consent.</li>
  <li>Use any device, software or routine that interferes with the proper working of the Platforms.</li>
  <li>Introduce any viruses, trojan horses, worms, logic bombs or other material which is malicious or technologically harmful.</li>
  <li>Attempt to gain unauthorized access to, interfere with, damage or disrupt any parts of the Platforms, the server on which the Platforms are stored, or any server, computer or database connected to the Platforms.</li>
  <li>Attack the Platforms via a denial-of-service attack or a distributed denial-of-service attack.</li>
  <li>Otherwise attempt to interfere with the proper working of the Platforms.</li>
  </ul>
  </div>

  <div class="mb-2 mt-2"><u><h4>COOPERATION WITH LAW ENFORCEMENT AND REGULATORY BODIES:</h4></u></div>

  <div class="mb-3">
  We have the right to fully cooperate with any law enforcement authorities, regulatory agencies, or court order requesting or directing us to disclose the identity or other information of anyone sharing information with us through the Platforms. YOU WAIVE AND HOLD HARMLESS THE COMPANY AND ITS AFFILIATES, LICENSEES AND SERVICE PROVIDERS FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN BY THE COMPANY AND/OR ANY OF THE FOREGOING PARTIES DURING OR AS A RESULT OF ITS INVESTIGATIONS AND FROM ANY ACTIONS TAKEN AS A CONSEQUENCE OF INVESTIGATIONS BY EITHER THE COMPANY OR SUCH PARTIES OR LAW ENFORCEMENT AUTHORITIES.
  </div>

  <div class="mb-2 mt-2"><u><h4>IMAGES, VIDEOS, AND ARTICLES:</h4></u></div>

  <div class="mb-2">
  We may display images, articles, audio, and video (the “Material”) on the Platforms from time to time. The types of Material users are authorized to access on the Site includes Material commissioned by the Company, embedded Material, Material we believe to be covered by the Fair Use Doctrine, Material from photographic archive and video vendors, and Material supplied to our staff or released into the public domain by public relations and marketing companies for press purposes.
  </div>

  <div class="mb-2 mt-2"><u><h4>RELIANCE ON INFORMATION POSTED:</h4></u></div>

  <div class="mb-2">
  We may, from time to time, post informative articles, whitepapers, links, or blog posts on the Platforms. The information presented on or through the Platforms is made available solely for general information purposes. We do not warrant the accuracy, completeness or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Platforms, or by anyone who may be informed of any of its contents.
  </div>

  <div class="mb-2">
  This Platforms may include content provided by third parties. All statements and/or opinions expressed in these materials, and all articles and responses to questions and other content, other than the Content provided by the Company, are solely the opinions and the responsibility of the person or entity providing those materials. These materials do not necessarily reflect the opinion of the Company. We are not responsible, or liable to you or any third party, for the content or accuracy of any materials provided by any third parties.
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
