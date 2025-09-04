'use client';

import { Stack, Typography, Link, List, ListItem, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme, type Theme } from '@mui/material/styles';

export default function PrivacyPolicy() {
  const theme = useTheme<Theme>();
  return (
    <Stack
      direction="column"
      minHeight="100dvh"
      height={"fit-content"}
      width={"100%"}
      px={{ xs: 0, lg: 6 }}
      py={{xs: 0, lg: 3}}
    >
      <Header />
      <Stack flex={1} sx={{ p: { xs: 3, md: 9 } }} justifyContent="start" gap={{xs: 2, lg: 4}}>
        <Stack sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
            Privacy Policy for the Presale Urano Ecosystem Landing Page
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Last updated: [25/07/2025]
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            1. Data controller
          </Typography>
          
          <Typography variant="body1" paragraph>
            Pursuant to Regulation (EU) 2016/679 (“GDPR”) and applicable data protection regulations, the Data Controller is:
          </Typography>
          
          <List dense>
            <ListItem>URANO ECOSYSTEM Sp. Z o.o.</ListItem>
            <ListItem>Registered office: ul. Mickiewicza 39A/3, 86-300 Grudziądz (Kuyavian-Pomeranian Voivodeship), Poland</ListItem>
            <ListItem>Registration number (KRS): 0001028647</ListItem>
            <ListItem>REGON: 524912675</ListItem>
            <ListItem>VAT number (NIP): 8762504246</ListItem>
            <ListItem>Contact email: official@uranoecosystem.com</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The Data Controller has appointed a Data Protection Officer (DPO), who can be reached at:{' '}
            <Link href="mailto:dpo@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              dpo@uranoecosystem.com
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            The processing of personal data also takes place in compliance with the obligations set forth in Regulation (EU) 2023/1114 (MiCA) regarding crypto-asset offerings, with particular attention to the provisions relating to user identification (KYC), information transparency, and the prevention of market abuse.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            2. Purpose of the processing
          </Typography>
          
          <Typography variant="body1" paragraph>
            The personal data collected through the landing page of the $URANO token Presale are processed for the following purposes:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>F1. Provision of services:</strong> allow registration for the Presale and provide informative content on the Urano Ecosystem project;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>F2. Identity Verification (KYC):</strong> verify the identity and age of users, in compliance with AML/CFT and MiCA regulations;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>F3. Administrative, technical and security management:</strong> ensure the correct functioning of the platform, prevent its abuse and guarantee its IT and operational security;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>F4. Regulatory and tax compliance:</strong> comply with applicable legal and sector-specific regulatory obligations, including those relating to the prevention of money laundering, counterterrorism, and transparency in crypto markets;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>F5. Mandatory communications:</strong> send notifications regarding changes to the Terms, Policies or legal updates, where necessary;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>F6. Protection of the Data Controller&apos;s rights:</strong> exercise or defend a right in or out of court.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Legal bases of the processing
          </Typography>
          
          <Typography variant="body1" paragraph>
            The processing of personal data by Urano Ecosystem is based on the following legal bases, pursuant to Article 6 of the GDPR:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>Performance of a contract or pre-contractual measures</strong> – pursuant to art. 6(1)(b) GDPR: processing is necessary to allow the user to access the Presale, to provide the related services and to fulfill the user&apos;s pre-contractual requests;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Fulfillment of legal obligations</strong> – pursuant to art. 6(1)(c) GDPR: in particular in relation to anti-money laundering legislation (AML/CFT), applicable tax legislation and the obligations set forth in Regulation (EU) 2023/1114 (MiCA), which require user identification and the traceability of relevant transactions;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Legitimate interests of the Data Controller</strong> – pursuant to art. 6(1)(f) GDPR: relating to fraud prevention, IT security, technical monitoring of the platform, and the protection of the Data Controller&apos;s legal rights, including in judicial or administrative proceedings. These interests are balanced against the data subject&apos;s fundamental rights and freedoms;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Explicit consent of the data subject</strong> – pursuant to Art. 6(1)(a) GDPR: required where necessary, for example, for the processing of special categories of data (such as biometric data managed by the KYC provider) or for the sending of optional communications. In any case, consent can be revoked at any time.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Age restriction
          </Typography>
          
          <Typography variant="body1" paragraph>
            Access to the Presale is reserved exclusively for adult users (18+). Urano Ecosystem does not intentionally collect or process personal data relating to minors. Any data accidentally collected will be promptly deleted.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            3. Methods of collecting personal data in the pre-sale
          </Typography>
          
          <Typography variant="body1" paragraph>
            Personal data is collected directly from the user at various stages of the Presale. Upon registration, we request and process identification data (first name, last name) and contact information (email address). To comply with legal and security obligations (including AML/CFT and MiCA), the user is redirected to the platform of our third-party provider, Persona Identities, Inc., for identity verification (KYC). During this process, Persona directly collects the necessary data, such as identity documents, contact information, and potentially biometric data with the user&apos;s consent, without us processing or storing it directly. Finally, to enable participation in the Presale, Urano Ecosystem receives only the public address of the user&apos;s blockchain wallet and technical metadata, such as the verification outcome (verified/unverified), a unique identifier, and a verification timestamp. Additionally, browsing data such as the IP address are collected automatically for security purposes and the proper functioning of the platform.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            4. Type of data processed
          </Typography>
          
          <Typography variant="body1" paragraph>
            In the context of registration and participation in the Presale, as well as simply browsing the landing page, Urano Ecosystem may process the following categories of personal data:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a. Identification data:</strong> name, surname, and other data requested during registration or identity verification;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b. Contact details:</strong> email address provided by the user;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c. KYC verification data:</strong> verification outcome (verified/not verified), unique transaction identifier, timestamp, country code, and technical metadata provided by the Persona provider;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d. Blockchain wallet address:</strong> public address associated with the user&apos;s wallet, used for the purposes of participating in the Presale and verifying eligibility;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>e. Browsing and technical data:</strong> IP address, user agent (browser/device), access times, referrer and system logs, collected automatically for security and statistical purposes;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>f. Data provided voluntarily:</strong> any additional information spontaneously communicated by the user in the forms on the site (e.g. contact requests, comments, suggestions).
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
            Note: Urano Ecosystem does not directly collect or process identity documents or biometric data. Such information, if requested, is managed independently and securely by the third-party provider Persona Identities, Inc., as specified in the section on identity verification.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            5. Legal basis for processing
          </Typography>
          
          <Typography variant="body1" paragraph>
            The processing of personal data by Urano Ecosystem is based on various legal bases, depending on the specific purposes pursued:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a. Performance of a contract or pre-contractual measures</strong> – ex art. 6(1)(b) GDPR: processing is necessary to allow the user to access the Presale, to provide related services and to fulfill pre-contractual requests by the user;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b. Fulfillment of legal obligations</strong> – ex art. 6(1)(c) GDPR: in particular in relation to anti-money laundering legislation (AML/CFT), applicable tax legislation and the obligations set forth in Regulation (EU) 2023/1114 (MiCA), which require user identification and the traceability of relevant transactions;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c. Legitimate interest of the Data Controller</strong> – ex art. 6(1)(f) GDPR: relating to fraud prevention, IT security, technical monitoring of the platform, and the protection of the Data Controller&apos;s legal rights, including in judicial or administrative proceedings. These interests are balanced against the data subject&apos;s fundamental rights and freedoms;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d. Explicit consent of the interested party</strong> – ex art. 6(1)(a) GDPR: required, where necessary, for example, to process special categories of data (such as biometric data managed by the KYC provider) or to send optional communications. In any case, consent can be revoked at any time.
              </Typography>
            </ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            6. Data retention
          </Typography>
          
          <Typography variant="body1" paragraph>
            Personal data will be retained for a period no longer than necessary to achieve the purposes indicated in this policy and, in particular:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> For data collected for identity verification purposes (KYC), retention will be guaranteed for at least 5 years from the termination of the contractual relationship, in compliance with applicable anti-money laundering (AML/CFT) regulations. The processing and storage of such data, where delegated to specialized external providers (e.g., Persona Identities, Inc.), will be carried out in compliance with contractual agreements and required security measures.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> For other data collected through the landing page (e.g. technical data, email, IP address), the retention period will not exceed 12 months from harvest, except for legal obligations, legal defense purposes, or requests from the competent authorities.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            At the end of the periods indicated above, the data will be deleted, anonymized or made inaccessible, unless their further retention is necessary to fulfill specific regulatory obligations or in the event of ongoing disputes.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            7. Recipients and data transfer
          </Typography>
          
          <Typography variant="body1" paragraph>
            Personal data may be disclosed, in compliance with the principles of lawfulness, necessity, and proportionality, exclusively to the following third parties:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> Technology and infrastructure service providers (e.g., cloud, hosting, IT security, platform maintenance), limited to the technical and operational purposes related to the provision of the service;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> Public authorities, regulatory or judicial bodies, in compliance with legal obligations or at their legitimate request (e.g. tax, anti-money laundering, judicial authorities);
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c.</strong> Professional consultants (legal, tax, accounting), limited to the fulfillment of regulatory obligations or to protect the rights of the Data Controller;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d.</strong> Persona Identities, Inc., as a third-party provider specializing in identity verification (KYC) services, as detailed in Section 10 of this Privacy Policy.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            All recipients are bound by contractual agreements which guarantee adequate security measures and compliance with current legislation on personal data protection (GDPR). In the event of transfers to third countries, the following measures will be applied: appropriate guarantees pursuant to Articles 44 et seq. of the GDPR (e.g. adequacy decisions, Standard Contractual Clauses).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            8. Transfers outside the EU
          </Typography>
          
          <Typography variant="body1" paragraph>
            Some personal data may be transferred to countries located outside the European Economic Area (EEA), including United States, particularly in the case of services provided by third parties such as Persona Identities, Inc., provider based in the USA (see paragraph 10).
          </Typography>
          
          <Typography variant="body1" paragraph>
            Such transfers will take place exclusively in compliance with the articles 44 and following of the GDPR, adopting one or more of the following appropriate guarantees:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> Standard Contractual Clauses (SCC) adopted by the European Commission pursuant to art. 46(2)(c) GDPR;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> Verification of the adequate level of data protection offered by the recipient, including through audits and declarations of compliance with the additional measures provided for by the EDPB Guidelines 01/2020;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c.</strong> Adoption of appropriate technical and organizational measures to guarantee the security, integrity, and prevention of unauthorized access to the personal data transferred.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The User can request further information on the applicable guarantees or a copy of the Standard Contractual Clauses by writing to:{' '}
            <Link href="mailto:official@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              official@uranoecosystem.com
            </Link>{' '}
            or{' '}
            <Link href="mailto:dpo@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              dpo@uranoecosystem.com
            </Link>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            9. Rights of the interested party
          </Typography>
          
          <Typography variant="body1" paragraph>
            The User, as an interested party, can exercise at any time the rights recognised by the articles 15-21 del GDPR, including:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a. Right of access:</strong> obtain confirmation of the existence or otherwise of personal data concerning him or her and access it;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b. Right to rectification:</strong> request the correction or updating of inaccurate or incomplete data;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c. Right to erasure (“right to be forgotten”):</strong> obtain the erasure of your data in the cases provided for by art. 17 GDPR;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d. Right to restriction of processing:</strong> request limitation of processing in the cases provided for by art. 18 GDPR;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>e. Right to object:</strong> object to the processing of data for reasons related to your particular situation (Article 21 GDPR);
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>f. Right to data portability:</strong> receive your data in a structured, commonly used and machine-readable format and, if technically feasible, transmit them to another data controller.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The User can exercise his/her rights by sending a request:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                via email to the Owner:{' '}
                <Link href="mailto:official@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                  official@uranoecosystem.com
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                or to the Data Protection Officer (DPO):{' '}
                <Link href="mailto:dpo@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                  dpo@uranoecosystem.com
                </Link>
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            Requests will be processed within 30 days from receipt, except for extensions in cases of particular complexity, in accordance with art. 12 GDPR.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The exercise of rights is free, except where requests are manifestly unfounded or excessive pursuant to art. 12(5) GDPR.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The User also has the right to lodge a complaint with a competent supervisory authority if he or she believes that the processing of his or her data violates the applicable legislation on the protection of personal data (Article 77 GDPR).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            10. Data security and protection
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Owner adopts appropriate technical and organizational measures, in accordance with the articles 24, 25 and 32 of the GDPR, in order to ensure a level of security appropriate to the risk, taking into account the nature, scope, context and purposes of the processing.
          </Typography>
          
          <Typography variant="body1" paragraph>
            In particular, measures are implemented aimed at:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> Guarantee the integrity, confidentiality and availability of the personal data processed;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> Prevent unauthorized access, accidental disclosure, destruction, loss, alteration or unlawful processing;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c.</strong> Apply encryption and pseudonymization techniques to protect the most sensitive data;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d.</strong> Perform periodic backups and disaster recovery systems for operational resilience;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>e.</strong> Regularly monitor and update digital infrastructure, including blockchain platforms and smart contracts used.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            Additionally, the smart contracts used for the $URANO token presale have been subjected to security audits by independent third parties to ensure transparency and protection of the technical interaction between the user and the protocol. More information is available on the official page:{' '}
            <Link href="https://www.uranoecosystem.com/audit" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/audit
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            When third-party providers are involved (e.g., for KYC or cloud hosting), Urano Ecosystem ensures that these parties are bound by contractual obligations regarding security and GDPR compliance.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            11. Identity verification services
          </Typography>
          
          <Typography variant="body1" paragraph>
            To ensure compliance with anti-money laundering (AML/CFT) regulations and Regulation (EU) 2023/1114 (MiCA), Urano Ecosystem uses the identity verification services provided by Persona Identities, Inc., a US-based company specializing in secure user onboarding and personal data protection, as Data controller pursuant to art. 28 of Regulation (EU) 2016/679 (GDPR).
          </Typography>
          
          <Typography variant="body1" paragraph>
            During the procedure KYC (Know Your Customer), the User is redirected to a secure session hosted directly on the Persona platform. There, Persona will collect and process the following data:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> Identification data (name, surname, date of birth, address);
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> Identity document (passport, identity card, driving licence, etc.);
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c.</strong> Facial recognition via selfie or short video (liveness check);
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d.</strong> Biometric data, where required and with explicit consent of the User;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>e.</strong> Any technical metadata required for verification.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            This data is processed exclusively for the following purposes:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>a.</strong> Verification of user identity;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>b.</strong> Prevention of fraud and illegal activities;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>c.</strong> Compliance with AML/CFT and MiCA regulatory obligations;
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>d.</strong> Security audits and legal retention, where applicable.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            Persona adopts advanced technical and organizational measures for data protection, including encryption, pseudonymization, instance isolation, continuous monitoring and granular access controls. The data is stored on infrastructures compliant with international standards, including SOC 2 Type II and ISO 27001.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The User retains the right to exercise the rights provided for by the GDPR at any time, including access, rectification, and deletion of data, directly through the Persona platform.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Urano Ecosystem does not directly access, store or process biometric data or identification documents uploaded by the User. It only receives:
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                The outcome of the verification (verified/not verified),
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                A unique identifier associated with the User,
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                A timestamp of the verification.
              </Typography>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            Persona Identities, Inc. guarantees full GDPR compliance and adheres to international data protection frameworks. Further details are available in their official policy:
          </Typography>
          
          <List dense>
            <ListItem>
              <Link href="https://withpersona.com/legal/privacy-policy?lang=it" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                https://withpersona.com/legal/privacy-policy?lang=it
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://withpersona.com/legal" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                https://withpersona.com/legal
              </Link>
            </ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            12. No automated decision-making
          </Typography>
          
          <Typography variant="body1" paragraph>
            Urano Ecosystem does not adopt automated decision-making processes, including the profiling, which produce legal effects the significant on the interested party, pursuant to the Article 22 of Regulation (EU) 2016/679 (GDPR).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            13. Cookies and tracking tools
          </Typography>
          
          <Typography variant="body1" paragraph>
            This landing page uses technical session cookies necessary for the proper functioning of the site and to guarantee the user secure access to services, including any integration with the identity verification system (KYC). These cookies fall into the category of essential cookies and do not require the user&apos;s consent, pursuant to current legislation (Article 122 of the Privacy Code and Article 5.3 of the ePrivacy Directive).
          </Typography>
          
          <Typography variant="body1" paragraph>
            Possible third party cookies they may be used for strictly necessary technical purposes (e.g. fraud prevention during KYC), in accordance with the technical measures applied by the provider Persona Identities, Inc. These cookies are active only to the extent that they are essential for the secure provision of the service.
          </Typography>
          
          <Typography variant="body1" paragraph>
            As for instead non-essential analytical, profiling or tracking cookies these are not used on this landing page. If they are implemented in the future, they will only be activated with the user&apos;s consent via a specific banner.
          </Typography>
          
          <Typography variant="body1" paragraph>
            For further details on the cookies used on this landing page, a specific document is available on the page:{' '}
            <Link href="https://www.uranoecosystempresale.com/cookie" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystempresale.com/cookie
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            For complete information on the cookies used across the entire Urano ecosystem, please refer to the official Cookie Policy, available at:{' '}
            <Link href="https://www.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/cookie-policy
            </Link>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            14. Changes to the Privacy Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Urano Ecosystem reserves the right to modify this Privacy Policy at any time, including as a result of regulatory updates, technological developments, or internal organizational changes.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Any changes will be communicated via official announcements published on institutional channels of the project, such as the website, official social media channels, and other public communications. Users are encouraged to periodically consult the most up-to-date version of the information.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The current version of the Privacy Policy is always available at the following address:{' '}
            <Link href="https://www.uranoecosystempresale.com/privacy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystempresale.com/privacy
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            For further information on the processing of personal data within the main site and the activities of the Urano ecosystem, please consult the general Privacy Policy available at the following link:{' '}
            <Link href="https://www.uranoecosystem.com/privacy-policy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/privacy-policy
            </Link>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            15. Regulatory validity
          </Typography>
          
          <Typography variant="body1" paragraph>
            This Privacy Policy is drafted in accordance with the Regulation (EU) 2016/679 (GDPR) and, where applicable, to the Regulation (EU) 2023/1114 (MiCA). It forms an integral part of the pre-contractual information provided to the User, pursuant to the applicable legislation regarding the protection of personal data and the regulation of services relating to crypto-assets.
          </Typography>

          <Divider sx={{ my: 4, borderColor: theme.palette.secondary.main }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            Last updated: [25/07/2025]
          </Typography>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}