'use client';

import { Stack, Typography, Link, List, ListItem, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme, type Theme } from '@mui/material/styles';

export default function Terms() {
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
        <Stack sx={{ p: { xs: 0, md: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
            Terms and Conditions – $URANO Token Presale
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Last updated: July 2025
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            1. Introduction
          </Typography>
          
          <Typography variant="body1" paragraph>
            This document regulates the access, navigation and participation in the presale (the &quot;Presale&quot;) of the $URANO token through the online platform reachable at the address <Link href="https://www.uranoecosystempresale.com" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>https://www.uranoecosystempresale.com</Link> (the &quot;Platform&quot;), made available by Urano Ecosystem Sp. z o.o. (the &quot;Company&quot; or the &quot;Issuer&quot;). These terms and conditions (the &quot;Terms&quot;) apply to all Users who interact with the Platform during the Pre-sale phase.
          </Typography>
          
          <Typography variant="body1" paragraph>
            By participating in the Presale, you represent that you have read, understood and fully accepted these Terms and that you assume full responsibility for your investment decisions and compliance with applicable regulations in your jurisdiction of residence or citizenship.
          </Typography>
          
          <Typography variant="body1" paragraph>
            These Terms constitute a legally binding agreement between the Issuer and each User.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            2. Disclaimer
          </Typography>
          
          <Typography variant="body1" paragraph>
            The content of this page is provided for informational purposes only and does not constitute an offer or solicitation to sell, nor a recommendation to buy, financial instruments, securities, or digital assets under applicable laws and regulations, including Regulation (EU) 2023/1114 on markets in crypto-assets (MiCA). Participation in the Urano token presale is subject to verification of eligibility requirements, including mandatory KYC/AML procedures in accordance with EU Anti-Money Laundering Directives and other applicable regulatory frameworks.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Urano does not guarantee any specific utility, performance, financial return, or appreciation in value of the token. Tokens issued during the presale do not confer shareholder rights, profit participation, or any legal claims against Urano Ecosystem Sp. z o.o. or its affiliates.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Participation in the presale is not permitted to residents or citizens of the United States, the United Kingdom, Canada, or any other jurisdiction where the sale of tokens is unauthorized or where such offering would be considered an offering of unregistered securities. Access may be further restricted or prohibited in jurisdictions where the sale of cryptoassets is illegal or subject to registration, licensing, or other regulatory requirements.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Potential participants are solely responsible for ensuring that their participation in the presale complies with the legal, regulatory, and tax obligations of their jurisdiction. It is strongly recommended that you consult with independent legal, financial, and tax advisors before participating in any token offering. By proceeding, you confirm that you have read and understand the associated risks and agree to the Terms and Conditions and Privacy Policy.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            3. Information on the Issuer
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Platform is managed by the company:
          </Typography>
          
          <List dense>
            <ListItem>Company name: Urano Ecosystem Sp. Z o.o.</ListItem>
            <ListItem>Registered office: Mickiewicza 39A/3, 86-300 Grudziądz, (Kuyavian-Pomeranian Voivodeship), Poland</ListItem>
            <ListItem>VAT number (NIP): 8762504246</ListItem>
            <ListItem>REGON: 524912675 – KRS: 0001028647</ListItem>
            <ListItem>Contacts: official@uranoecosystem.com – dpo@uranoecosystem.com</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The Company is registered as Virtual Asset Service Provider (VASP) and is registered at Polish Register of Virtual Currency Activities, held by the Director of the Katowice Chamber of Tax Administration (Director of the Tax Administration Chamber in Katowice) and officially published on
            <Link href="https://www.slaskie.kas.gov.pl/izba-administracji-skarbowej-w-katowicach/zalatwianie-spraw/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych/-/asset_publisher/R7Yl/content/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych" target="_blank" rel="noopener" sx={{ ml: 0.5, textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.slaskie.kas.gov.pl/izba-administracji-skarbowej-w-katowicach/zalatwianie-spraw/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych/-/asset_publisher/R7Yl/content/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych
            </Link>
            pursuant to national anti-money laundering legislation.
          </Typography>
          
          <Typography variant="body1" paragraph>
            In anticipation of the entry into full application of the Regulation (EU) 2023/1114 (MiCA), the Company has started the transition procedure towards registration as Crypto Asset Service Provider (CASP).
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Issuer adopts and maintains an internal compliance system that satisfies the requirements set out in the matter of anti-money laundering (AML/CFT), according to the recommendations of the FATF and the provisions of the General Data Protection Regulation (GDPR).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            4. Purpose of the presale
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Presale aims to distribute a limited share of the $URANO token to early supporters of the Urano Ecosystem project.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The $URANO token is classified as a utility token pursuant to Regulation (EU) 2023/1114 (MiCA) and does not in any way constitute a financial security, a derivative instrument, an e-money token, nor a security representing equity or debt.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Presale&apos;s primary goal is to raise funds for the development of Urano&apos;s Web3 infrastructure, including DeFi solutions, on-chain functional modules, and Real World Assets (RWA) tokenization components, while also promoting the platform&apos;s integration and adoption within the Arbitrum ecosystem.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            5. Use of funds raised
          </Typography>
          
          <Typography variant="body1" paragraph>
            The funds raised through the $URANO token presale will be used exclusively to pursue the strategic objectives of the Urano Ecosystem project and will not be distributed in any way for profit to founding members, teams, or previous investors. Specifically, the funds raised will be allocated according to the following areas:
          </Typography>
          
          <List dense>
            <ListItem>Development and maintenance of technology infrastructure, including protocol updates, security audits, pen-testing, user experience improvements, and backend optimization;</ListItem>
            <ListItem>Strengthening cybersecurity measures and protocol resilience to cyber attacks;</ListItem>
            <ListItem>Strategic marketing activities, advertising campaigns, brand awareness, community management, and the formation of commercial and institutional partnerships;</ListItem>
            <ListItem>Implementation, evolution and maintenance of the uApp, uShares and uStation functional modules, and the associated decentralized governance mechanisms;</ListItem>
            <ListItem>Coverage of management and development costs, including those related to regulatory compliance, including obligations related to the MiCA Regulation (EU) 2023/1114, anti-money laundering (AML/CFT) regulations, and identity verification procedures (KYC);</ListItem>
            <ListItem>Operational expansion into target markets both in the European Union and in third countries in compliance with local regulations.</ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            6. $URANO Token Features
          </Typography>
          
          <Typography variant="body1" paragraph>
            The $URANO token is classified as utility token pursuant to the Art. 3, paragraph 1, point 5 of Regulation (EU) 2023/1114 (MiCA), and is issued for exclusively functional purposes within the Uranus ecosystem. Its technical and functional characteristics are as follows:
          </Typography>
          
          <List dense>
            <ListItem>Token Name: URANUS</ListItem>
            <ListItem>Ticker: $URANO</ListItem>
            <ListItem>Type: Utility Token (non-financial, non-hybrid, non-e-money token)</ListItem>
            <ListItem>Technical Standard: ERC-20</ListItem>
            <ListItem>Emission Network: Decision One (Layer 2 on Ethereum)</ListItem>
            <ListItem>Supply Totale: $1,000,000,000 URANUS (Supply limited, deflation system)</ListItem>
            <ListItem>
              Smart Contract: Audited by independent providers with reports available on{' '}
              <Link href="https://www.uranoecosystem.com/audit" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                https://www.uranoecosystem.com/audit
              </Link>
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The token does not confer any patrimonial or financial rights, nor does it imply any form of guaranteed return, dividend distribution, repurchase or right to participate in the capital of the issuing company. The only area in which the holder can exercise a decision-making influence is the governance of the protocol.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The token does not constitute, pursuant to current legislation:
          </Typography>
          
          <List dense>
            <ListItem>a financial instrument within the meaning of the MiFID II Directive (2014/65/EU);</ListItem>
            <ListItem>a security representing capital or debt;</ListItem>
            <ListItem>an e-money token pursuant to Art. 3(1)(7) MiCA;</ListItem>
            <ListItem>nor an activity-related token pursuant to Art. 3(1)(6) MiCA.</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The $URANO token contract address will be made public and verified on Arbiscan:{' '}
            <Link href="https://www.arbiscan.io" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              www.arbiscan.io
            </Link>{' '}
            (The exact address will be communicated at the time of the official deployment and before the tokens are distributed).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            7. Token Utility
          </Typography>
          
          <Typography variant="body1" paragraph>
            The $URANO token represents the native tool for interacting with the modules and services of the Urano ecosystem. It is conceived solely as utility token pursuant to the Art. 3(1)(5) and Art. 4 of Regulation (EU) 2023/1114 (MiCA), and does not have any financial nature, nor does it entail any patrimonial rights or performance obligations.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Use of the token is subject to passing identity verification (KYC) procedures, in compliance with current AML/CFT regulations and through authorized third-party providers.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The main features planned for the $URANO token include:
          </Typography>
          
          <List dense>
            <ListItem>Access to the Urano platform services: possession of the token allows you to interact with functional modules of the Urano infrastructure, including tools for viewing, interacting with, and using tokenized assets, in compliance with the conditions indicated for each module.</ListItem>
            <ListItem>Participation in DAO governance (staking required): Holders who stake their $URANO can actively participate in the protocol&apos;s decentralized governance, exercising proportional voting rights on strategic proposals, updates, and DAO fund allocation.</ListItem>
            <ListItem>Priority participation in tokenization offerings: Token holders can benefit from priority access to real-world asset (RWA) tokenization transactions conducted through the uApp platform.</ListItem>
            <ListItem>Discretionary merit-based rewards: the protocol provides for non-automatic incentives, awarded based on merit, active participation, technical contributions, and value to the community. These rewards may include airdrops, token assignments or distributions, and special recognitions approved by the governance.</ListItem>
            <ListItem>Interoperability with integrated partners: the token may be used in the future to interact with third-party services and protocols connected to the Urano ecosystem, where technically and legally compatible.</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The above features will be activated gradually. The actual availability of each feature will be announced through official updates and additional documentation. Use of these features will be subject to their technical implementation and compliance with applicable regulatory requirements.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Any additional features, including the ability to use the $URANO token as a form of collateralization in DeFi modules internal or external to the ecosystem, fall within the development objectives in the medium term of the project. However, such uses will be explicitly regulated and made public only following technical checks, independent audits and full confirmation regulatory compliance, and do not currently constitute a legally binding commitment on the part of the Issuer.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            8. Tokenomics and Allocation
          </Typography>
          
          <Typography variant="body1" paragraph>
            The total supply of $URANO is set at 1.000.000.000 token, divided into different categories according to the following allocation scheme:
          </Typography>
          
          <Typography variant="body1" paragraph>
            Category | Allocated Tokens | % of Total | Cliff (months) | Vesting (months) | Unlock TGE (%) | Token Unlock TGE
          </Typography>
          
          <Typography variant="body1" paragraph>
            Strategic Round | 20.000.000 | 2,00% | 3 | 24 | 5,00% | 1.000.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Seed Round | 40.000.000 | 4,00% | 3 | 16 | 7,00% | 2.800.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Private Round | 20.000.000 | 2,00% | 2 | 15 | 10,00% | 2.000.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Institutional Round | 10.000.000 | 1,00% | 3 | 24 | 10,00% | 1.000.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Community Round | 40.000.000 | 4,00% | 0 | 9 | 12,00% | 4.800.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Team | 120.000.000 | 12,00% | 6 | 25 | 0,00% | 0
          </Typography>
          
          <Typography variant="body1" paragraph>
            Foundation | 80.000.000 | 8,00% | 9 | 25 | 0,00% | 0
          </Typography>
          
          <Typography variant="body1" paragraph>
            Advisors | 50.000.000 | 5,00% | 3 | 12 | 1,00% | 500.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Staking / Ecosystem Incentives | 270.000.000 | 27,00% | 0 | 48 | 5,00% | 13.500.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Marketing | 100.000.000 | 10,00% | 0 | 24 | 5,00% | 5.000.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            AMM Liquidity Pool / CEX Listing | 165.000.000 | 16,50% | 0 | 6 | 3,20% | 5.280.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Community Airdrop & Grants | 85.000.000 | 8,50% | 0 | 12 | 6,00% | 5.100.000
          </Typography>
          
          <Typography variant="body1" paragraph>
            Grand total: 1,000,000,000 tokens – 100% of the total offer
          </Typography>
          
          <Typography variant="body1" paragraph>
            Tokens issued to the TGE: 40.980.000 (4,098%)
          </Typography>
          
          <Typography variant="body1" paragraph>
            All tokens are managed via smart contracts programmed to apply automatically cliff, lock-up e vesting in a transparent manner. The contracts are audited by third parties and will be available on the page:{' '}
            <Link href="https://www.uranoecosystem.com/audit" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/audit
            </Link>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            9. Staking
          </Typography>
          
          <Typography variant="body1" paragraph>
            The token $URANO may be used, in a phase subsequent to the development of the platform, for activities staking on-chain, through specially designed modules integrated into Uranus&apos; infrastructure.
          </Typography>
          
          <Typography variant="body1" paragraph>
            It staking will consist of lock in a certain amount of $URANO tokens for a predefined period, in order to:
          </Typography>
          
          <List dense>
            <ListItem>Obtain periodic rewards in token;</ListItem>
            <ListItem>Access additional features of the platform;</ListItem>
            <ListItem>Contribute to the decentralized governance (in combination with staking);</ListItem>
            <ListItem>Strengthen the ecosystem stability encouraging long-term participation.</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The planned features, subject to subsequent release, may include:
          </Typography>
          
          <List dense>
            <ListItem>Definition of minimum blocking periods (locking period);</ListItem>
            <ListItem>Calculation of variable interest rate (APY), linked to the selected staking module, the number of tokens staked, the allocated liquidity and the duration of the commitment;</ListItem>
            <ListItem>Possible mechanisms of early revocation, subject to penalties and unlock times;</ListItem>
            <ListItem>Mandatory Identity Verification (KYC)to access the service, in compliance with AML/CFT regulations;</ListItem>
            <ListItem>Compatibility with DeFi protocols and potential integration with external partners selected.</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            All technical details, contractual terms, and operating procedures relating to staking will be made available in a dedicated section on the official website:{' '}
            <Link href="https://www.uranoecosystem.com/staking" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/staking
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            Joining the staking service will be always on a voluntary basis and subject to acceptance of the specific conditions published upon release.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            10. Decentralized Governance (DAO)
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Uranus Protocol integrates a governance system decentralized (DAO), designed to ensuretransparency, inclusivenessandactive participation from the community.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Token holders $URANOwill be able, through on-chain mechanisms, propose and vote on the following areas:
          </Typography>
          
          <List dense>
            <ListItem>Strategic initiatives relating to the evolution of the platform;</ListItem>
            <ListItem>Resource Allocation coming from the Treasury DAO;</ListItem>
            <ListItem>Definition or modification of the development roadmap;</ListItem>
            <ListItem>Selection and approval of technical integrations the strategic partnerships;</ListItem>
            <ListItem>Activation or modification of functional modules.</ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Participation requirements
          </Typography>
          
          <Typography variant="body1" paragraph>
            Active participation in governance is conditioning from the following requirements:
          </Typography>
          
          <List dense>
            <ListItem>Staking daily token $URANO: Only users who stake their tokens will be able to vote and propose initiatives.</ListItem>
            <ListItem>Basic rule: 1 $URANO in staking = 1 voto on-chain</ListItem>
            <ListItem>Identity Verification (KYC): In compliance with AML/CFT regulations, completing identity verification through a certified provider is mandatory to access the governance module.</ListItem>
            <ListItem>Compatible wallet: Interactions will take place via verifiable and audited smart contracts, accessible from supported wallets.</ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Reward system (utility-based)
          </Typography>
          
          <Typography variant="body1" paragraph>
            In order to encourage a qualitative involvement, the protocol provides for a system of non-automatic rewards, assigned on a per-unit basis meritocratic, including:
          </Typography>
          
          <List dense>
            <ListItem>Periodic rewards in tokens or reputation badges for the key contributors;</ListItem>
            <ListItem>Privileged access to testnets, beta modules or operational roles for those who develops or supports significant proposals;</ListItem>
            <ListItem>In the future, any awards made by the DAO based on Shared KPIs.</ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Voting mechanism
          </Typography>
          
          <Typography variant="body1" paragraph>
            • There is no minimum quorum required for the validity of votes, in order to facilitate fluidity and speed of decision-making;
          </Typography>
          
          <Typography variant="body1" paragraph>
            • Each proposal will be subject to a default time limit (e.g. 5 or 7 days) within which it will be possible to vote;
          </Typography>
          
          <Typography variant="body1" paragraph>
            • At the end of the established period, the proposal will be automatically approved or rejected based on the votes cast.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The governance rules and voting model will be governed by smart contract auditating, and described in the official technical documents.
          </Typography>

          {/* Continue with the rest of the sections following the same pattern */}

          <Divider sx={{ my: 4, borderColor: theme.palette.secondary.main }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            Last updated: July 2025
          </Typography>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}