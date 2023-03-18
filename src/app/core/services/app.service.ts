import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs";
import { Client } from "../models/client";

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor() {}

  // TODO move into state
  public isAgentsInitialized = false;
  public isOptimizationsInitialized = false;

  public apps$: BehaviorSubject<Array<Client>> = new BehaviorSubject([]);

  static privacyPolicy: string = `
  <div><h4>Adoya, Inc. Privacy Policy</h4></div>

  <div class="mb-4">Last Modified: July 17, 2022</div>

  <div class="mb-2">
  Adoya, Inc. (“Adoya,”"we," or “us”) respects your privacy and is committed to protecting it through our compliance with this “Privacy Policy.” Throughout this Privacy Policy, we refer to any person accessing or using these Platforms (as defined below) as “you,” or the “User.”
  </div>

  <div class="mb-2">
  This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit the websites www.adoya-app.io/portal and/or www.adoya.io, the services, features, content, and any applications (“Apps”) offered by Adoya (collectively our "Platforms") and our practices for collecting, using, maintaining, protecting and disclosing that information.
  </div>


  <div class="mb-2 mt-2"><h4>This Privacy Policy applies to information we collect:</h4></div>
  <div class="mb-2">
  <ul>
  <li>On or through these Platforms.</li>
  <li>In email, text, and other electronic messages between you and these Platforms.</li>
  <li>When you interact with our advertising and applications on third-party websites and services, if
  those applications or advertising include links to this Privacy Policy.</li>
  </ul>
  </div>


  <div class="mb-2 mt-2"><h4>It does not apply to information collected by:</h4></div>
  <div class="mb-2">
  <ul>
  <li>Us offline or through any other means not listed above; or</li>
  <li>Any third party (including our affiliates and subsidiaries) website or application. Please be aware
  that we have no control over the content and policies of third-party platforms and cannot accept responsibility or liability for their respective privacy practices.</li>
  </ul>
  </div>


  <div class="mb-2">
  Please read this Privacy Policy carefully to understand our policies and practices regarding your Personal Information (as defined below in INFORMATION WE COLLECT) and how we will treat it. If you do not agree with our policies and practices, your only choice is not to use our Platforms. By accessing or using our Platforms, you agree to this Privacy Policy. This Privacy Policy may change from time to time. Your continued use of the Platforms after we make changes is deemed to be your acceptance of those changes, so please check the Privacy Policy periodically for updates.
  </div>

  <div class="mb-2 mt-2"><h4>Adoya’s Privacy Assurance</h4></div>
  <div class="mb-2">
  <ul>
  <li>We do not sell your Personal Information to any third parties.</li>
  <li>We do not share your Personal Information with nonaffiliated third parties that would use it to
  contact you about their own products and services, unless you have allowed us to do so and as
  permitted pursuant to a joint marketing agreement.</li>
  <li>We require our employees to protect your Personal Information and keep it confidential.</li>
  <li>We require persons or organizations that represent or assist us in serving you to keep your
  information confidential.</li>
  </ul>
  </div>


  <div class="mb-2 mt-2"><u><h4>CHILDREN UNDER THE AGE OF 13:</h4></u></div>
  <div class="mb-2">
  Our Platforms are not intended for children under 13 years of age. No one under the age of 13 may provide any Personal Information to Adoya or through the Platforms. We do not knowingly collect Personal Information from children under 13. If you are under 13, do not use or provide any information through any of the Platforms’ features/functionality, make any purchases through the Platforms, use any of the interactive features that may be available on these Platforms, or provide any information about yourself to us, including your name, address, telephone number, and/or email address. If we learn that we have collected or received Personal Information from a child under 13 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 13, please contact us at info@adoya.io.
  </div>



  <div class="mb-2 mt-2"><u><h4>INFORMATION WE COLLECT:</h4></u></div>
  <div class="mb-2">
  We collect several types of information from and about Users of our Platforms, including log data, device data, and Personal Information.
  </div>


  <div class="mb-2 mt-2"><h4>Log Data</h4></div>
  <div class="mb-2">
  When you visit our Platforms, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
  </div>


  <div class="mb-2 mt-2"><h4>Device Data</h4></div>
  <div class="mb-2">
  We may also automatically collect data about the device you’re using to access our Platforms. This data may include the device type, operating system, unique device identifiers, device settings, and location data. What we collect depends on the individual settings of your device and software.
  </div>

  <div class="mb-2 mt-2"><h4>Personal Information</h4></div>
  <div class="mb-2">
  We may collect information from you while you use these Platforms, including:
  <ul>
  <li>By which you may be personally identified, such as your name, email address, payment information, and other identifying information that you choose to share with us by which you
  may be contacted online or offline ("Personal Information"); and/or</li>
  <li>That is about you but individually does not identify you, such as your annual revenue, gender, certain demographic information. This information is not considered Personal
  Information, as it is anonymized statistical data.
  </li>
  </ul>
  </div>


  <div class="mb-2 mt-2"><u><h4>HOW WE COLLECT INFORMATION:</h4></u></div>
  <div class="mb-2 mt-2"><h4>Information We Collect Automatically</h4></div>
  <div class="mb-2">
  As you navigate through and interact with our Platforms, we may use automatic data collection technologies to collect certain information about your devices, browsing actions and patterns, as described above. The technologies we use for this automatic data collection may include cookies, flash cookies, or web beacons. For more information on these technologies, see our DATA COLLECTION POLICY below. The information we collect automatically is statistical data and does not include Personal Information, but we may maintain it for any of the reasons listed in HOW WE USE YOUR INFORMATION.
  </div>

  <div class="mb-2 mt-2"><h4>Information You Provide Directly to Us</h4></div>
  <div class="mb-2">
  The information we collect on or through our Platforms may include:
  <ul>
  <li>Information that you provide by filling in forms on our Platforms. This includes information provided at the time of registering to use our Platforms or joining our mailing list. We may also ask you for information when you report a problem with our Platforms;</li>
  <li>Records and copies of your correspondence (including email addresses), if you contact us; and/or</li>
  <li>Details of transactions you carry out through our Platforms.</li>
  </ul>
  </div>

  <div class="mb-2 mt-2"><h4>Information Provided to Us by Third Parties</h4></div>
  <div class="mb-2">
  If we receive Personal Information about you from a third party, we will protect it as set out in this Privacy Policy. If you are a third party providing Personal Information about somebody else, you represent and warrant that you have such person’s consent to provide the Personal Information to us.
  </div>



  <div class="mb-2 mt-2"><u><h4>DATA COLLECTION POLICY:</h4></u></div>
  <div class="mb-2">
  The technologies we use for automatic data collection on these Platforms may include:
  <ul>
  <li>Cookies (or browser cookies). A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Platforms. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies
  when you direct your browser to our Platforms</li>
  <li>Flash Cookies. Certain features of our Platforms may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from and on our Platforms. Flash cookies are not managed by the same browser settings as are used for browser cookies; and/or</li>
  <li>Web Beacons. Pages of the Platforms, and our emails, may contain small electronic files known as web beacons (also referred to as clear gifs. pixel tags and single-pixel gifs) that permit Adoya, for example, to count Users who have visited those pages, or opened an email, and for other related statistics (for example, recording the popularity of certain content on the Platforms and verifying system and server integrity).</li>
  </ul>
  </div>

  <div class="mb-2 mt-2"><h4>DO NOT TRACK:</h4></div>
  <div class="mb-2">
  “Do Not Track” is a preference you can set your browser to let websites you visit know that you do not want them collecting certain information about you. We do not currently respond to, or honor, Do Not Track signals or requests from your browser.
  </div>


  <div class="mb-2 mt-2"><h4>THIRD-PARTY USE OF COOKIES AND OTHER TRACKING TECHNOLOGIES:</h4></div>
  <div class="mb-2">
  Some content or applications on the Platforms are served by third parties, including content providers and application providers. These third parties may use cookies (alone or in conjunction with web beacons or other tracking technologies) to collect information about you when you use our Platforms. The information they collect may be associated with your Personal Information, or they may collect information, including Personal Information, about your online activities over time and across different websites and other online services. They may use this information to provide you with interest-based (behavioral) advertising or other targeted content.
  </div>

  <div class="mb-2">
  We do not control these third parties' tracking technologies or how they may be used. If you have any questions about an advertisement or other targeted content, you should contact the responsible provider directly.
  </div>


  <div class="mb-2 mt-2"><u><h4>HOW WE USE YOUR INFORMATION:</h4></u></div>
  <div class="mb-2">
  We may collect your information for a number of reasons, specifically:

  <ul>
  <li>To enable you to access and use our Platforms;</li>
  <li>To enable you to customize or personalize your experience of our Platforms;</li>
  <li>To contact and communicate with you;</li>
  <li>To prevent fraud;</li>
  <li>For internal record keeping and administrative purposes;</li>
  <li>For analytics, market research, and business development, including to operate and improve our
  Platforms;</li>
  <li>To offer additional benefits to you, including but not limited to sending promotional information
  about our products/services and/or facilitating competitions and/or giveaways;</li>
  <li>To provide you with information about third parties that may be of interest to you;</li>
  <li>To fulfill any other purpose for which you provide your information and consent; and/or</li>
  <li>To comply with our legal obligations and resolve any disputes that we may have.</li>
  </ul>
  </div>




  <div class="mb-2 mt-2"><h4>DISCLOSURE OF YOUR INFORMATION, GENERALLY:</h4></div>
  <div class="mb-2">
  We disclose Personal Information that we collect or that you provide, as described in this Privacy Policy, in the following circumstances:

  <ul>
  <li>To our subsidiaries and affiliates;</li>
  <li>To contractors, service providers and other third parties we use to support our business and who are
  bound by contractual obligations to keep Personal Information confidential and use it only for the
  purposes for which we disclose it to them;</li>
  <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization,
  dissolution or other sale or transfer of some or all of Adoya’s assets, whether as a going concern or as part of bankruptcy, liquidation or similar proceeding, in which Personal Information held by Adoya about our Platforms’ Users is among the assets transferred. You acknowledge that such transfers may occur, and that any parties who acquire us may continue to use your Personal Information according to this Privacy Policy;</li>
  <li>To fulfill the purpose for which you provide it;</li>
  <li>For any other purpose disclosed by us when you provide the information; or</li>
  <li>With your consent.</li>
  </ul>
  </div>



  <div class="mb-2 mt-2"><h4>DISCLOSURE OF YOUR INFORMATION TO THIRD PARTIES:</h4></div>
  <div class="mb-2">
  We may disclose your Personal Information to third party service providers for the purpose of enabling them to provide their services, if you have allowed us to do so, including but not limited to:
  <ul>
  <li>Information Technology (“IT”) service providers;</li>
  <li>Data storage, hosting, and server providers;</li>
  <li>Analytics companies;</li>
  <li>Error loggers;</li>
  <li>Maintenance or problem-solving providers;</li>
  <li>Marketing or advertising providers;</li>
  <li>Professional advisors;</li>
  <li>Payment systems operators; and/or</li>
  <li>Sponsors or promoters of any competition or promotion we run.</li>
  </ul>
  </div>



  <div class="mb-2">
  We may also disclose your Personal Information to third parties for the purpose of establishing, exercising, or defending our legal rights, including but not limited to:
  <ul>
  <li>Debt collectors;</li>
  <li>Our legal counsel and/or prospective legal counsel; and/or</li>
  <li>Courts, tribunals, regulatory authorities, and law enforcement officers, as required by law.</li>
  </ul>

  We may disclose aggregated, anonymized, statistical data and/or non-identifying information about our Users without restriction.
  </div>


  <div class="mb-2 mt-2"><h4>CHOICES ABOUT HOW WE USE AND DISCLOSE YOUR INFORMATION:</h4></div>

  <div class="mb-2">
  We strive to provide you with choices regarding the Personal Information you provide to us. The following mechanisms should help to provide you with control over your information:
  <ul>
  <li>Tracking Technologies and Advertising. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe's website. If you disable or refuse cookies, please note that some parts of these Platforms may be inaccessible or not function properly.</li>
  <li>Promotional Offers from Adoya or our Affiliates. If you do not wish to have your email address/contact information used by Adoya or its affiliates to promote our own or third parties' products or services, you can opt-out by sending us an email stating your request to info@adoya.io. If we have sent you a promotional email, you may use the unsubscribe option in the footer of the email. This opt out does not apply to information provided to info@adoya.io as a result of a product or service purchase, or other transactions.</li>
  </ul>

  We do not control third parties' collection or use of your information to serve interest-based advertising. However, these third parties may provide you with ways to choose not to have your information collected or used in this way. You can opt out of receiving targeted ads from members of the Network Advertising Initiative ("NAI") on the NAI's website.
  </div>


  <div class="mb-2 mt-2"><h4>ACCESSING AND CORRECTING YOUR INFORMATION:</h4></div>
  <div class="mb-2">
  If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant or misleading, you can review and change your Personal Information by logging into your account profile on the Platforms and navigating to the appropriate settings page or sending us an email at info@adoya.io to request access to, correct, or delete any Personal Information that you have provided to us. We cannot delete some of your Personal Information except by also deleting your User account. We may not accommodate a request to change information if we believe the change would violate any law or regulatory requirement, result in fraud, or cause the information to be incorrect.
  </div>


  <div class="mb-2 mt-2"><h4>YOUR CALIFORNIA PRIVACY RIGHTS:</h4></div>
  <div class="mb-2">
  If you are a California resident, you have the right to request information from us regarding the manner in which we share certain categories of your Personal Information with third parties for their own direct marketing uses. California’s “Shine the Light” Act provides that you have the right to submit a request to us at our email address in order to receive information on the categories of customer information that we shared and the names and addresses of those businesses with which we shared customer information for the immediately prior calendar year. To obtain this information, please send an email message to info@adoya.io with "Request for California Privacy Information" in the subject line and in the body of your message. We will provide the requested information to you in your email address in response.
  </div>

  <div class="mb-2">
  Please be aware that not all information sharing is covered by the Shine the Light requirements, and only information on covered sharing will be included in our response.
  </div>

  <div class="mb-2 mt-2"><h4>DATA SECURITY:</h4></div>
  <div class="mb-2">
  We have implemented measures designed to secure your Personal Information from accidental loss and from unauthorized access, use, alteration and disclosure. All information you provide to us through the Platforms is secured by TLS technology, and is stored on our secure, password protected servers behind firewalls. We have implemented a restricted employee access for all of our servers containing personally identifiable information.
  </div>

  <div class="mb-2">
  Any payment transactions will be encrypted using SSL technology. We use Stripe (PCI-DSS compliant) as our payment processor.
  </div>


  <div class="mb-2">
  The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Platforms, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
  </div>


  <div class="mb-2">
  Unfortunately, the transmission of information via the Internet is not completely secure. Although we do our best to protect your Personal Information, we cannot guarantee the security of your Personal Information transmitted to our Platforms. Any transmission of Personal Information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Platforms.
  </div>


  <div class="mb-2 mt-2"><h4>CHANGES TO OUR PRIVACY POLICY:</h4></div>
  <div class="mb-2">
  It is our policy to post any changes we make to our Privacy Policy on this page, with a notice that the Privacy Policy has been updated on the Platforms’ home pages. If we make material changes to how we treat our Users' Personal Information, we will notify you by email to the most recent email address provided to Adoya either through correspondence or through your User account and/or through a notice on the Platforms’ home pages. The date the Privacy Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our Platforms and this Privacy Policy to check for any changes.



  <div class="mb-2 mt-2"><h4>CONTACT INFORMATION:</h4></div>
  <div class="mb-2">
  To ask questions, or make a comment about this Privacy Policy and our privacy practices, contact us at: info@adoya.io or 5029 Geary Blvd. #6, San Francisco, California 94118
  </div>

  `;

  static clickWrap: string = `
  <div><h4>Adoya, Inc. User Agreement</h4></div>

  <div class="mb-4">Last Modified: July 17, 2022</div>


  <div class="mb-2">
  adoya-app.io and adoya.io along with any accompanying applications (collectively the “Platforms”) are operated by Adoya, Inc. (“we,” “us,” “our,” “Adoya,” or the “Company”). Before registering with the Company for a user account on these Platforms, please read the following User Agreement (these “Terms” or the “Agreement”) carefully to understand our policies and practices regarding your information, how we will treat it, what we expect of you during your use of the Platforms, and payment information.
  </div>

  <div class="mb-2">
  You are required to read, understand, and agree to the Terms prior to using the Platforms as a registered user. We refer to you, the person who will click to accept or agree to these Terms when this option is made available to you, as the “User.”
  </div>

  <div class='text-center'><h4>ACCESSING AND USING THE WEBSITE</h4></div>

  <div><u><h4>ACCEPTANCE OF THE TERMS:</h4></u></div>
  <div class="mb-2">
  By clicking to accept or agree to this Agreement when this option is made available to you, you accept and agree to be bound and abide by these Terms, including our Privacy Policy below. If you do not want to agree to these Terms or the Privacy Policy, you must not access or use the Platforms as a registered user. Please note, the Privacy Policy, as well as our general terms of use, will apply to all unregistered users. If you do not agree to those terms, you must not access or use the Platforms whatsoever, whether as a registered or unregistered user.
  </div>

  <div class="mb-2">
  The Platforms are offered and available to users who are 18 years of age or older and reside in the United States or any of its territories or possessions. By using these Platforms, you represent and warrant that you are of legal age to form a binding contract with the Company and meet all of the foregoing eligibility requirements. If you do not meet all of these requirements, you must not access or use the Platforms.
  </div>


  <div><u><h4>ACCESSING THE PLATFORMS AND ACCOUNT SECURITY:</h4></u></div>
  <div class="mb-2">
  We reserve the right to withdraw or amend these Platforms, and any service or material we provide on the Platforms, in our sole discretion without notice. We will not be liable if, for any reason, all or any part of the Platforms are unavailable at any time or for any period.
  </div>

  <div class="mb-2">
  From time to time, we may restrict access to some parts of the Platforms, or the entirety of the Platforms, to users, including registered users. You are responsible for making all arrangements necessary for you to have access to the information hosted on the Platforms and ensuring that all persons who access the Platforms through your Internet connection are aware of these Terms and comply with them.
  </div>

  <div class="mb-2">
  To access the Platforms, or some of the resources they offer, you may be asked to provide certain registration details or other information. Details requested include, but are not limited to, first and last name, email address, and credit card information (when applicable). It is a condition of your use of the Platforms that all the information you provide on the Platforms is correct, current, truthful, and complete. You agree that all information you provide to register with these Platforms or otherwise, including but not limited to through the use of any interactive features on the Platforms, is governed by our Privacy Policy below, and you consent to all actions we take with respect to your information consistent with our Privacy Policy.
  </div>

  <div class="mb-2">
  If you choose, or are provided with, a username, password or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. You also acknowledge that your account is personal to you and agree not to provide any other person with access to these Platforms, or portions of it, using your username, password or other security information. You agree to notify us immediately of any unauthorized access to or use of your username or password or any other breach of security. You also agree to ensure that you exit from your account at the end of each session. You should use particular caution when accessing your account from a public or shared computer so that others are not able to view or record your password or other personal information.
  </div>

  <div class="mb-2">
  We reserve the right to disable any username, password or other identifier, whether chosen by you or provided by us, at any time, in our sole discretion, for any or no reason, including if, in our opinion, you have violated any provision of these Terms.
  </div>



  <div><u><h4>YOUR PERSONAL INFORMATION:</h4></u></div>
  <div class="mb-2">
  All information we collect on these Platforms are subject to our Privacy Policy below. By using the Platforms, you consent to all actions taken by us with respect to your information in compliance with the Privacy Policy.
  </div>


  <div><u><h4>RELIANCE ON INFORMATION POSTED:</h4></u></div>
  <div class="mb-2">
  We may, from time to time, post informative articles, whitepapers, links, or blog posts on the Platforms. The information presented on or through the Platforms is made available solely for general information purposes. We do not warrant the accuracy, completeness or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Platforms, or by anyone who may be informed of any of its contents.
  </div>

  <div class="mb-2">
  This Platforms may include content provided by third parties. All statements and/or opinions expressed in these materials, and all articles and responses to questions and other content, other than the Content provided by the Company, are solely the opinions and the responsibility of the person or entity providing those materials. These materials do not necessarily reflect the opinion of the Company. We are not responsible, or liable to you or any third party, for the content or accuracy of any materials provided by any third parties.
  </div>

  <div class="mb-2">
  We may update the Content on these Platforms from time to time, but their Content is not necessarily complete or up to date. Any of the material on the Platforms may be out of date at any given time, and we are under no obligation to update such material.
  </div>



  <div><u><h4>LINKS TO THIRD-PARTY CONTENT:</h4></u></div>
  <div class="mb-2">
  The Platforms contains links to other sites and resources provided by third parties. These links are provided for your convenience only. We have no control over the contents of the websites or resources linked and accept no responsibility for them or for any loss or damage that may arise from your use of them. If you decide to access any of the third-party websites linked to these Platforms, you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
  </div>



  <div><u><h4>GEOGRAPHIC RESTRICTIONS:</h4></u></div>
  <div class="mb-2">
  The owner of the Platforms is based in the state of California, in the United States of America. We provide these Platforms for use only by persons located in the United States, unless otherwise specifically indicated. We make no claims that the Platforms or any of its Content is accessible or appropriate outside of the United States. Access to the Platforms may not be legal by certain persons or in certain countries. If you access the Platforms from outside the United States, you do so on your own initiative and are responsible for compliance with local laws.
  </div>


  <div class="mb-2 mt-2"><u><h4>PROHIBITED USES:</h4></u></div>
  <div class="mb-3">
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




  <div><u><h4>THE COMPANY’S INTELLECTUAL PROPERTY RIGHTS:</h4></u></div>
  <div class="mb-2">
  <div>The Platforms and their entire contents, features and functionality, including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof (collectively the “Content”), are owned by the Company, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.</div>
  <div>These Terms of Use grant you a limited, revocable, non-transferable, and non-exclusive license to use the Platforms for your personal use only. <strong>You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Platforms, except as follows:</strong></div>
  <div>If you wish to make any use of material on the Platforms other than that set out in this section, please address your request to: info@adoya.io.</div>
  <div><strong>You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Platforms, except as follows:<u>not:</u></strong></div>
  <ul>
      <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
      <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
      <li>You may print or download one copy of a reasonable number of pages of the Platforms for your own personal, non-commercial use and not for further reproduction, publication or distribution.</li>
      <li>If we provide social media features in connection with certain Content, you may take such actions as are enabled by such features.</li>
  </ul>
  <div><strong>You must <u>not:</u></strong></div>
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



  <div class="mb-2 mt-2"><u><h4>TRADEMARKS:</h4></u></div>
  <div class="mb-3">
  The Company name, the Company logo and all related names, logos, product and service names, designs and slogans are trademarks of the Company or its affiliates or licensors. You must not use such marks without the prior written permission of the Company, except in a manner constituting “fair use.” All other names, logos, product and service names, designs and slogans on these Platforms are the trademarks of their respective owners.
  </div>


  <div class="mb-2 mt-2"><u><h4>EMAIL CORRESPONDENCE:</h4></u></div>
  <div class="mb-3">
  Emails sent to any @adoya.io email address are considered our property. You can read more about this in our Privacy Policy https://www.adoya.io/privacy. If you wish to remain anonymous, please specify this in the body of the email itself and we will do our best to respect your wishes.
  </div>


  <div class="mb-2 mt-2"><u><h4>IMAGES, VIDEOS, AND ARTICLES:</h4></u></div>
  <div class="mb-3">
  We may display images, articles, audio, and video (the “Material”) on the Platforms from time to time. The types of Material users are authorized to access on the Site includes Material commissioned by the Company, embedded Material, Material we believe to be covered by the Fair Use Doctrine, Material from photographic archive and video vendors, and Material supplied to our staff or released into the public domain by public relations and marketing companies for press purposes.
  </div>



  <div class="mb-2 mt-2"><u><h4>PAID SERVICES OFFERED THROUGH THE PLATFORMS:</h4></u></div>
  <div class="mb-2">
  Adoya optimizes Apple Search Ads campaigns for your iOS app(s). When you subscribe to use the paid services offered through Adoya, you’ll have access to the following:
  <ul>
  <li>Campaign builds</li>
  <li>Performance optimizations</li>
  <li>Proprietary optimization software</li>
  <li>Performance reports</li>
  </ul>
  </div>

  <div class="mb-2">
  Your subscription shall only be used for one business entity per account, unless otherwise specified. If you own or operate multiple business entities, you must purchase separate subscriptions for each business entity.
  </div>

  <div class="mb-2">
  Subject to these Terms, Adoya will use commercially reasonable efforts to provide paid users with the services described in this section. Adoya may, at its sole discretion, offer additional services (“Additional Services”) to users for purchase at additional fees. However, Adoya will never bill you for additional services without your express written approval. Should you and Adoya mutually agree to additional services not contemplated in these Terms, Adoya will execute an individualized addendum to these Terms outlining such additional services.
  </div>



  <div class="mb-2 mt-2"><u><h4>TERM:</h4></u></div>
  <div class="mb-3">
  The default term for paid services is one (1) calendar month. This term will automatically renew and shall continue from month-to-month, until terminated by either you or Adoya. Notwithstanding the preceding sentence, Adoya retains the right to increase or decrease your fee for paid services or refuse to renew the services offered by giving you one month’s notice of such increase, decrease, or non-renewal. In the case of a fee increase or decrease, you will also be given the option of terminating your subscription for paid services at the end of the month prior to the fee increase or decrease coming into effect.
  </div>




  <div class="mb-2 mt-2"><u><h4>PAYMENT:</h4></u></div>
  <div class="mb-3">
  The first 30 days of Adoya is free. After that, Adoya will provide Apple Search Ads campaign management support at a rate of $250 per month. The first billable month will be prorated.
  Subsequent months will be billed at the entire $250 per month rate. You understand and agree that your payment information will be stored and charged automatically on the first calendar day of each month.
  </div>

  <div class="mb-3">
  You are responsible for payment regardless of whether or not you have received a payment reminder notification from the Company prior to your monthly billing date. Currently, the Company does not charge sales tax, however this policy is subject to change with thirty (30) calendar days’ notice by the Company to you.
  </div>

  <div class="mb-3">
  If your payment method is declined or payment is otherwise not made, the Company reserves the right to terminate your subscription to paid services. It is your responsibility solely to ensure that the payment method on file with the Company is up to date at all times, to avoid the possible termination of your subscription to paid services.
  </div>



  <div class="mb-2 mt-2"><u><h4>CLIENT COLLABORATION:</h4></u></div>
  <div class="mb-3">
  In order to access the paid services offered by Adoya, a paid User must provide access to their ad campaign and analytics accounts. User’s failure to provide such information may cause delays in delivery of the services or results of such services with no penalty to Adoya. Users will not be entitled to refunds or proration for periods of time in which Adoya was unable to deliver the services or results of such services as a result of a User’s failure to provide such information.
  </div>




  <div class="mb-2 mt-2"><u><h4>CHANGES TO SERVICES:</h4></u></div>
  <div class="mb-3">
  The paid services offered may be subject to change, and should Adoya decide, in its sole and ultimate discretion, to make substantial or material changes to the paid services offered under these Terms, Adoya agrees to provide a thirty (30) day notice of any such substantial or material changes and all paid users shall have the right to terminate their paid subscription services as a result of such substantial or material changes, at no penalty to users.
  </div>



  <div class="mb-2 mt-2"><u><h4>THIRD-PARTY PERFORMANCE:</h4></u></div>
  <div class="mb-3">
  Adoya’s paid services are combined, integrated, or used with third party products, services, software applications, or websites (“Third Party Service”), including but not limited to third-party analytics tools and marketing channels. Users are responsible for obtaining all necessary licenses for Third Party Services.
  </div>

  <div class="mb-3">
  In the event of any changes by Third Party Services that materially affect the delivery or performance of Adoya’s paid services, Adoya shall not be responsible. Adoya shall endeavor to create integrations, plug-ins, or manual connectivity options that enable users to connect the paid services offered by Adoya to Third Party Services in order to facilitate data transfer. However, in the event that the paid services offered through Adoya are unable to integrate with any Third Party Services and users are unable to transfer data, Adoya shall not be responsible for ensuring connectivity and users shall not be entitled to refund or proration. It is each user’s responsibility solely to ensure that the paid services offered through Adoya are compatible with the Third Party Services purchased by the user.
  </div>

  <div class="mb-3">
  Lastly, in the event that any bugs in Third Party Services or in any of the software provided and/or utilized by Adoya causes any financial losses to users, each User understands and expressly agrees that the only remedy for such losses shall be credits provided by Adoya for future services and such credits shall only be issued in Adoya’s sole discretion.
  </div>




  <div class="mb-2 mt-2"><u><h4>NON-DISCLOSURE:</h4></u></div>
  <div class="mb-3">
  You acknowledge that, as a subscriber to paid services offered by Adoya, you may have occasion to receive or review certain confidential or proprietary technical and business information and materials of Adoya. You undertake at all times, both during and subsequent to your use of the paid services, not to disclose, except solely to the extent that such disclosure is authorized in writing by Adoya, and not to use, except for the purposes specifically contemplated by these Terms, all information which is of a confidential nature and of value to Adoya. This includes but is not limited to Adoya’s paid products, tools, processes, and particulars of other commercial information whether or not that information is contained in documents marked as confidential. Upon termination of your subscription to paid services offered through Adoya, howsoever occurring, you will destroy all confidential or proprietary information of Adoya that is in your possession.
  </div>




  <div class="mb-2 mt-2"><u><h4>NON-SOLICITATION:</h4></u></div>
  <div class="mb-3">
  For the duration of your use of the paid services offered by Adoya and for one (1) year following the termination of your subscription to such paid services for any reason, you agree not to directly or indirectly call on, solicit, persuade or attempt to solicit or persuade, or in any way reduce, interfere, or cause to cease any business with any employee, partner, designer, consultant, independent contractor, or other client of Adoya that you have become acquainted with as a result, directly or indirectly, of the paid services. In the event that you do solicit any such party, you shall pay to Adoya a fee equal to fifty percent (50%) of the employee or independent contractor's annual wage or rate or of the client’s previous fees due to Adoya that were invoiced or billed over the previous twelve month period (the "Placement Fee"). The Placement Fee must be paid within fifteen (15) days of the date of such hiring/retention.
  </div>



  <div class="mb-2 mt-2"><u><h4>SATISFACTION:</h4></u></div>
  <div class="mb-3">
  The obligation of a paid User to make payment to Adoya according to these Terms is not conditioned on the User’s satisfaction with the proceeds of any paid services under these Terms. You understand and expressly agree that delivery of the paid services shall obligate a User to make payment and payment shall not be withheld due to User dissatisfaction.
  </div>



  <div class="mb-2 mt-2"><u><h4>TERMINATION OF PAID SERVICES:</h4></u></div>
  <div class="mb-3">
  Either you or Adoya may terminate the paid services with or without cause by giving notice to the other of such termination. If you would like to cancel the paid services to which you have subscribed, you can do so through the Platforms. In the unlikely event that Adoya will be terminating the paid services offered to you, Adoya will notify you by sending an email to the email address associated with your user profile. Once Adoya receives your notice of termination or upon Adoya’s notice of termination to you, you are no longer entitled to any paid services under these Terms.
  </div>

  <div class="mb-3">
  A User may cancel the paid services at any time. If the services are terminated by a User mid-billing cycle, User will be billed in a prorated fee. Notwithstanding the foregoing, Users must terminate the paid services within seven (7) calendar days of the next billing date to ensure they are not billed for the next calendar month. In the event that the services are terminate by a User with less than seven (7) days left in a billing cycle, the User may be billed for the next calendar month and in such case, User shall not be entitled to refund or proration.
  </div>



  <div class="mb-2 mt-2"><u><h4>FORCE MAJEURE:</h4></u></div>
  <div class="mb-3">
  Adoya shall not be deemed in breach of this Agreement if Adoya is unable to offer the paid services or any portion thereof by reason of fire, earthquake, labor dispute, act of a public enemy, death, illness, or incapacity of a key Adoya employee, or any local, state, federal, national or international law, governmental order or regulation, or any other event beyond Adoya’s control (collectively “Force Majeure Events”). Upon occurrence of any Force Majeure Event, Adoya shall give notice to users of its inability to perform or of delay in offering paid services and may offer a credit to users for additional service time.
  </div>



  <div class="mb-2 mt-2"><u><h4>NON-EXCLUSIVE:</h4></u></div>
  <div class="mb-3">
  The paid services are non-exclusive. Adoya is free to provide paid services to other parties at any time.
  </div>


  <div class="mb-2 mt-2"><u><h4>COOPERATION WITH LAW ENFORCEMENT AND REGULATORY BODIES:</h4></u></div>
  <div class="mb-3">
  We have the right to fully cooperate with any law enforcement authorities, regulatory agencies, or court order requesting or directing us to disclose the identity or other information of anyone sharing information with us through the Platforms. YOU WAIVE AND HOLD HARMLESS THE COMPANY AND ITS AFFILIATES, LICENSEES AND SERVICE PROVIDERS FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN BY THE COMPANY AND/OR ANY OF THE FOREGOING PARTIES DURING OR AS A RESULT OF ITS INVESTIGATIONS AND FROM ANY ACTIONS TAKEN AS A CONSEQUENCE OF INVESTIGATIONS BY EITHER THE COMPANY OR SUCH PARTIES OR LAW ENFORCEMENT AUTHORITIES.
  </div>


  <div class="mb-2 mt-2"><u><h4>DISCLAIMER OF WARRANTIES BY COMPANY:</h4></u></div>
  <div class="mb-3">
  You understand that we cannot and do not guarantee or warrant that files available for downloading from the Internet or the Platforms will be free of viruses or other destructive code. You are responsible for implementing sufficient procedures and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data input and output, and for maintaining a means external to our Platforms for any reconstruction of any lost data. No data transmission over the Internet can be guaranteed to be 100% safe. Thus, we cannot warrant that your information will be absolutely secure. The Company has a variety of safeguards – technical, administrative, and physical – in place to help protect against unauthorized access to, use, or disclosure of user information. WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE PLATFORMS OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS OR TO YOUR DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
  </div>

  <div class="mb-3">
  YOUR USE OF THE PLATFORMS, THEIR CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS IS AT YOUR OWN RISK. THE PLATFORMS, THEIR CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY OR AVAILABILITY OF THE PLATFORMS. WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY REPRESENTS OR WARRANTS THAT THE PLATFORMS, THEIR CONTENT OR ANY SERVICES OBTAINED THROUGH THE PLATFORMS WILL BE ACCURATE, RELIABLE, ERROR-FREE OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR PLATFORMS OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE PLATFORMS OR ANY SERVICES OBTAINED THROUGH THE PLATFORMS WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
  </div>

  <div class="mb-3 text-uppercase">
  It is your responsibility to regularly monitor your accounts (Adoya and/or other advertising & marketing networks) to ensure performance and spend are as expected. You understand that without regular monitoring on your part, Adoya’s services may result in undesirable and unintended performance and ad spend. Adoya is not responsible for said results nor is Adoya obligated to issue credits or refunds for said unintended results.
  </div>

  <div class="mb-3">
  THE COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR PARTICULAR PURPOSE.
  </div>

  <div class="mb-3">
  THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE FEDERAL OR STATE LAW.
  </div>


 <div class="mb-2 mt-2"><u><h4>INDEMNIFICATION:</h4></u></div>
 <div class="mb-3">
 You agree to defend, indemnify and hold harmless the Company, its affiliates, licensors and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Platforms, including, but not limited to, your user contributions, any use of the Platforms' Content, services and products other than as expressly authorized in these Terms or your use of any information obtained from the Platforms.
 </div>



  <div class="mb-2 mt-2"><u><h4>GOVERNING LAW:</h4></u></div>
  <div class="mb-3">
  All matters relating to the Platforms and these Terms and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of California, without giving effect to any choice or conflict of law provision or rule.
  </div>

  <div class="mb-3">
  Any legal suit, action or proceeding arising out of, or related to, these Terms or the Platforms shall be instituted exclusively in the federal courts of the United States or the courts of the State of California, in each case located in the City of San Francisco, and County of San Francisco, although we retain the right to bring any suit, action or proceeding against you for breach of these Terms in your country or county of residence, or any other relevant country or county. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
  </div>


  <div class="mb-2 mt-2"><u><h4>ARBITRATION:</h4></u></div>
  <div class="mb-3">
  If you have any issue or dispute with the Company, you agree to first contact us at info@adoya.io and attempt to resolve the dispute with us informally. If we are not been able to resolve the dispute with you informally, both parties agree to resolve any claim, dispute, or controversy (excluding claims for injunctive or other equitable relief) arising out of or in connection with or relating to these Terms by binding arbitration by the American Arbitration Association ("AAA") under the Commercial Arbitration Rules and Supplementary Procedures for Consumer Related Disputes then in effect for the AAA, except as provided herein.
  </div>

  <div class="mb-3">
  Unless both parties agree otherwise, the arbitration will be conducted in San Francisco County, California. Each party will be responsible for paying their respective AAA filing, administrative and arbitrator fees in accordance with AAA rules. The award rendered by the arbitrator shall include costs of arbitration, reasonable attorneys' fees, and reasonable costs for expert and other witnesses, and any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction. Nothing in this Section shall prevent either party from seeking injunctive or other equitable relief from the courts for matters related to data security, intellectual property or unauthorized access to the Service.
  </div>


  <div class="mb-3">
  ALL CLAIMS MUST BE BROUGHT IN THE PARTIES' INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING, AND, UNLESS WE AGREE OTHERWISE, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS. YOU AGREE THAT, BY ENTERING INTO THESE TERMS, YOU AND THE COMPANY ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS ACTION.
  <div>


  <div class="mb-2 mt-2"><u><h4>LIMITATION ON TIME TO FILE CLAIMS:</h4></u></div>
  <div class="mb-3">
  ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THESE TERMS OF USE OR THE PLATFORMS MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.
  </div>



  <div class="mb-2 mt-2"><u><h4>WAIVER AND SEVERABILITY:</h4></u></div>
  <div class="mb-3">
  No waiver by the Company of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of the Company to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.
  </div>

  <div class="mb-3">
  If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.
  </div>



  <div class="mb-2 mt-2"><u><h4>ENTIRE AGREEMENT:</h4></u></div>
  <div class="mb-3">
  These Terms, and our Privacy Policy and user agreement, constitute the sole and entire agreement between you and us with respect to the Platforms and services provided, and supersede all prior and contemporaneous understandings, agreements, representations and warranties, both written and oral, with respect to the Platforms.
  </div>


  <div class="mb-2 mt-2"><u><h4>CHANGES TO THE TERMS:</h4></u></div>
  <div class="mb-3">
  We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Platforms thereafter. However, any changes to the dispute resolution provisions set forth in GOVERNING LAW will not apply to any disputes for which the parties have actual notice prior to the date the change is posted on the Platforms.
  </div>

  <div class="mb-3">
  Your continued use of the Platforms following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page from time to time so that you are aware of any changes, as they are binding on you. A printed version of these Terms of Service and of any notices given to you in electronic form or otherwise shall be admissible in judicial or administrative proceedings based upon or relating to these Terms of Service to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.
  </div>


  ${AppService.privacyPolicy}

  `;
  static termsOfService: string = `
  <div><h4>Adoya, Inc. Terms of Use</h4></div>

  <div class="mb-4">Last Modified: July 17, 2022</div>

  <div class="mb-2">
  adoya-app.io and adoya.io are operated by Adoya, Inc. Throughout these “Terms of Use” we use the terms “we”, “us”, “our”, or the “Company” to refer to Adoya, Inc. We refer to any person accessing or using this website as “You,” or the “User.”
  </div>


  <div class="mb-2">
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



  <div class="mb-2 mt-2"><u><h4>CHANGES TO THE PLATFORMS:</h4></u></div>
  <div class="mb-2">
  We may update the Content on these Platforms from time to time, but their Content is not necessarily complete or up to date. Any of the material on the Platforms may be out of date at any given time, and we are under no obligation to update such material.
  </div>



  <div class="mb-2 mt-2"><u><h4>YOUR PERSONAL INFORMATION:</h4></u></div>
  <div class="mb-2">
  All information we collect on these Platforms are subject to our Privacy Policy https://www.adoya.io/privacy. By using the Platforms, you consent to all actions taken by us with respect to your information in compliance with the Privacy Policy.
  </div>



  <div class="mb-2 mt-2"><u><h4>ONLINE PURCHASES AND OTHER TERMS AND CONDITIONS:</h4></u></div>
  <div class="mb-2">
  All purchases through our Platforms or other transactions for the sale of services formed through the Platforms or as a result of visits made by you are governed by our user agreement, which incorporates these Terms of Use. You will be asked to accept the user agreement before purchasing services, and upon acceptance, the user agreement shall be binding.
  </div>



  <div class="mb-2 mt-2"><u><h4>LINKS TO OTHER WEBSITES:</h4></u></div>
  <div class="mb-2">
  The Platforms contains links to other sites and resources provided by third parties. These links are provided for your convenience only. We have no control over the contents of the websites or resources linked, and accept no responsibility for them or for any loss or damage that may arise from your use of them. If you decide to access any of the third-party websites linked to these Platforms, you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
  </div>




  <div class="mb-2 mt-2"><u><h4>GEOGRAPHIC RESTRICTIONS:</h4></u></div>
  <div class="mb-2">
  The owner of the Platforms is based in the state of California, in the United States of America. We provide these Platforms for use only by persons located in the United States, unless otherwise specifically indicated. We make no claims that the Platforms or any of its Content is accessible or appropriate outside of the United States. Access to the Platforms may not be legal by certain persons or in certain countries. If you access the Platforms from outside the United States, you do so on your own initiative and are responsible for compliance with local laws.
  </div>



  <div class="mb-2 mt-2"><u><h4>DISCLAIMER OF WARRANTIES:</h4></u></div>
  <div class="mb-2">
  You understand that we cannot and do not guarantee or warrant that files available for downloading from the Internet or the Platforms will be free of viruses or other destructive code. You are responsible for implementing sufficient procedures and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data input and output, and for maintaining a means external to our Platforms for any reconstruction of any lost data. No data transmission over the Internet can be guaranteed to be 100% safe. Thus, we cannot warrant that your information will be absolutely secure. The Company has a variety of safeguards – technical, administrative, and physical – in place to help protect against unauthorized access to, use, or disclosure of user information. WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE PLATFORMS OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS OR TO YOUR DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
  </div>

  <div class="mb-2">
  YOUR USE OF THE PLATFORMS, THEIR CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS IS AT YOUR OWN RISK. THE PLATFORMS, THEIR CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORMS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY OR AVAILABILITY OF THE PLATFORMS. WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY REPRESENTS OR WARRANTS THAT THE PLATFORMS, THEIR CONTENT OR ANY SERVICES OBTAINED THROUGH THE PLATFORMS WILL BE ACCURATE, RELIABLE, ERROR-FREE OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR PLATFORMS OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE PLATFORMS OR ANY SERVICES OBTAINED THROUGH THE PLATFORMS WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
  </div>


  <div class="mb-3 text-uppercase">
  It is your responsibility to regularly monitor your accounts (Adoya and/or other advertising & marketing networks) to ensure performance and spend are as expected. You understand that without regular monitoring on your part, Adoya’s services may result in undesirable and unintended performance and ad spend. Adoya is not responsible for said results nor is Adoya obligated to issue credits or refunds for said unintended results.
  </div>

  <div class="mb-2">
  THE COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR PARTICULAR PURPOSE.
  </div>

  <div class="mb-2>
  THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE FEDERAL OR STATE LAW.
  </div>


  <div class="mb-2 mt-2"><u><h4> INDEMNIFICATION:</h4></u></div>
  <div class="mb-2">
  You agree to defend, indemnify and hold harmless the Company, its affiliates, licensors and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Use or your use of the Platforms, including, but not limited to, your user contributions, any use of the Platforms' Content, services and products other than as expressly authorized in these Terms of Use or your use of any information obtained from the Platforms.
  </div>



  <div class="mb-2 mt-2"><u><h4>GOVERNING LAW: </h4></u></div>
  <div class="mb-2">
  All matters relating to the Platforms and these Terms of Use and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of California, without giving effect to any choice or conflict of law provision or rule.
  </div>

  <div class="mb-2>
  Any legal suit, action or proceeding arising out of, or related to, these Terms of Use or the Platforms shall be instituted exclusively in the federal courts of the United States or the courts of the State of California, in each case located in the City of San Francisco, and County of San Francisco, although we retain the right to bring any suit, action or proceeding against you for breach of these Terms of Use in your country or county of residence, or any other relevant country or county. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
  </div>



  <div class="mb-2 mt-2"><u><h4>ARBITRATION </h4></u></div>
  <div class="mb-2">
  If you have any issue or dispute with the Company, you agree to first contact us at info@adoya.io and attempt to resolve the dispute with us informally. If we are not been able to resolve the dispute with you informally, both parties agree to resolve any claim, dispute, or controversy (excluding claims for injunctive or other equitable relief) arising out of or in connection with or relating to these Terms by binding arbitration by the American Arbitration Association ("AAA") under the Commercial Arbitration Rules and Supplementary Procedures for Consumer Related Disputes then in effect for the AAA, except as provided herein.
  </div>

  <div class="mb-2">
  Unless both parties agree otherwise, the arbitration will be conducted in San Francisco County, California. Each party will be responsible for paying their respective AAA filing, administrative and arbitrator fees in accordance with AAA rules. The award rendered by the arbitrator shall include costs of arbitration, reasonable attorneys' fees, and reasonable costs for expert and other witnesses, and any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction. Nothing in this Section shall prevent either party from seeking injunctive or other equitable relief from the courts for matters related to data security, intellectual property or unauthorized access to the Service.
  </div>

  <div class="mb-2">
  ALL CLAIMS MUST BE BROUGHT IN THE PARTIES' INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING, AND, UNLESS WE AGREE OTHERWISE, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS. YOU AGREE THAT, BY ENTERING INTO THESE TERMS, YOU AND THE COMPANY ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS ACTION.
  </div>



  <div class="mb-2 mt-2"><u><h4> LIMITATION ON TIME TO FILE CLAIMS:</h4></u></div>
  <div class="mb-2">
  ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THESE TERMS OF USE OR THE PLATFORMS MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.
  </div>


  <div class="mb-2 mt-2"><u><h4> WAIVER AND SEVERABILITY: </h4></u></div>
  <div class="mb-2">
  No waiver by the Company of any term or condition set forth in these Terms of Use shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of the Company to assert a right or provision under these Terms of Use shall not constitute a waiver of such right or provision.
  </div>

  <div class="mb-2">
  If any provision of these Terms of Use is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms of Use will continue in full force and effect.
  </div>



  <div class="mb-2 mt-2"><u><h4>ENTIRE AGREEMENT: </h4></u></div>
  <div class="mb-2">
  These Terms of Use, and our Privacy Policy and user agreement, constitute the sole and entire agreement between you and us with respect to the Platforms and services provided, and supersede all prior and contemporaneous understandings, agreements, representations and warranties, both written and oral, with respect to the Platforms.
  </div>


  <div class="mb-2 mt-2"><u><h4>CHANGES TO THE TERMS OF USE: </h4></u></div>
  <div class="mb-2">
  We may revise and update these Terms of Use from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Platforms thereafter. However, any changes to the dispute resolution provisions set forth in GOVERNING LAW will not apply to any disputes for which the parties have actual notice prior to the date the change is posted on the Platforms.
  </div>

  <div class="mb-2">
  Your continued use of the Platforms following the posting of revised Terms of Use means that you accept and agree to the changes. You are expected to check this page from time to time so that you are aware of any changes, as they are binding on you. A printed version of these Terms of Service and of any notices given to you in electronic form or otherwise shall be admissible in judicial or administrative proceedings based upon or relating to these Terms of Service to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.
  </div>



  <div class="mb-2 mt-2"><u><h4>YOUR COMMENTS AND CONCERNS: </h4></u></div>
  <div class="mb-2">
  These Platforms are operated Adoya, Inc.
  </div>

  <div class="mb-2">
  All feedback, comments, requests for technical support and other communications relating to the Platforms should be directed to info@adoya.io or 5029 Geary Blvd. #6, San Francisco, California, 94118.
  </div>


  `;

  static faqs: string = `
  <div ><h4>Frequently Asked Questions</h4></div>

  <div><h4>How does Adoya compliment Apple Search Ads?</h4></div>
  <div class="mb-4">
  Adoya compliments Apple Search Ads by automating best practices including bidding, adding top-performing search terms as targeted keywords, adding poor-performing search terms as negative keywords, sending daily email reports, and integrating with mobile measurement partners (MMPs) to report and optimize on post-install events. View Adoya as your “Growth Marketer” in a box. We aren’t meant to replace Apple Search Ads. We compliment it!
  </div>

  <div><h4>When should I use Adoya and when should I use the native Apple Search Ads platform? </h4></div>
  <div class="mb-4">
  You should use Adoya for day-to-day campaign management like bids, budgets, and updating settings. Use the native Apple Search Ads platform if you want deeper analytics, adjust settings that aren’t available in the Adoya platform like geo targeting. Use the native Apple Search Ads platform if you want to pause or add new keywords to existing campaigns.
  </div>

  <div><h4>What if I want to create a new campaign?</h4></div>
  <div class="mb-4">
  Adoya recommends you run campaigns via our proprietary method which you would have created when you signed up with us. However, feel free to use the native Apple Search Ads console to create new campaigns. Contact <a href="https://adoya-app.io/workbench/support" target="_blank" class="adoya-link font-weight-bold">support</a> if you want to utilize our automated bid management system for newly created campaigns and we’ll do a sync for you!
  </div>

  <div><h4>What is your refund policy?</h4></div>
  <div class="mb-4">
  Review our <a href="https://adoya-app.io/legal/terms" target="_blank" class="adoya-link font-weight-bold">terms of service</a> for more information on our refund policy.
  </div>

  <div><h4>Who do I contact with a billing question or issue?:</h4></div>
  <div class="mb-4">
  Email info@adoya.io or contact <a href="https://adoya-app.io/workbench/support" target="_blank" class="adoya-link font-weight-bold">support</a> and we’ll respond to you within 24 hours.
  </div>


  <div><h4>What other ad platforms do you support?:</h4></div>
  <div class="mb-4">
  We currently support Apple Search Ads but if there’s a platform you recommend, contact info@adoya.io and provide a suggestion. We’d love to hear from you!
  </div>

  <div><h4>Where do I provide feedback?</h4></div>
  <div class="mb-4">
  Contact <a href="https://adoya-app.io/workbench/support" target="_blank" class="adoya-link font-weight-bold">support</a> or email info@adoya.io. We love feedback!
  </div>

  <div><h4>What if I want to promote multiple apps or locations?</h4></div>
  <div class="mb-4">
  Currently Adoya supports 1:1 app and location mapping. However, if this changes, we’ll let you know.
  </div>


  <div><h4> Do you provide an account manager?</h4></div>
  <div class="mb-4">
  Adoya doesn’t offer managed services. We keep things streamlined to keep down costs and pass that cost savings down to you. However, if you have an urgent issue, contact us at info@adoya.io and we’ll reach out to you within 24 hours and provide a customized solution.
  </div>

  <div><h4>What if I want to build something customized?</h4></div>
  <div class="mb-4">
  Contact us at info@adoya.io or <a href="https://adoya-app.io/workbench/support" target="_blank" class="adoya-link font-weight-bold">support</a> and we’ll evaluate options!
  </div>

  <div><h4>What’s your cancellation policy?</h4></div>
  <div class="mb-4">
  Cancel anytime via info@adoya.io or <a href="https://adoya-app.io/workbench/support" target="_blank" class="adoya-link font-weight-bold">support</a>

  For our complete list of terms including cancellation policy, visit: https://adoya-app.io/legal/clickwrap
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
