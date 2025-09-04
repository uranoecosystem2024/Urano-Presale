import { Stack, Typography, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
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
      <Stack flex={1} px={{ xs: 1, lg: 5 }} py={4} justifyContent="start" gap={{xs: 2, lg: 4}}>
        <Stack sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
            Termini e Condizioni – Presale del Token $URANO
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            1. Introduzione
          </Typography>
          <Typography variant="body1" paragraph>
            Il presente documento disciplina l&apos;accesso, la navigazione e la partecipazione alla prevendita (la &quot;Presale&quot;) del token $URANO attraverso la piattaforma online raggiungibile all&apos;indirizzo https://www.uranoecosystempresale.com (la &quot;Piattaforma&quot;), messa a disposizione da Urano Ecosystem Sp. z o.o. (la &quot;Società&quot; o l&apos;&quot;Emittente&quot;). I presenti termini e condizioni (i &quot;Termini&quot;) si applicano a tutti gli Utenti che interagiscono con la Piattaforma durante la fase di Presale.
          </Typography>
          <Typography variant="body1" paragraph>
            Partecipando alla Presale, l&apos;Utente dichiara di aver letto, compreso e accettato integralmente i presenti Termini, assumendosi la piena responsabilità delle proprie decisioni d&apos;investimento e della conformità con le normative applicabili nella propria giurisdizione di residenza o cittadinanza.
          </Typography>
          <Typography variant="body1" paragraph>
            I presenti Termini costituiscono un accordo giuridicamente vincolante tra l&apos;Emittente e ciascun Utente.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            2. Informazioni sull&apos;Emittente
          </Typography>
          <Typography variant="body1" paragraph>
            La Piattaforma è gestita dalla società:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Ragione sociale: Urano Ecosystem Sp. Z o.o.</li>
            <li>Sede legale: ul. Mickiewicza 39A/3, 86-300 Grudziądz, (Kujawsko-Pomorskie), Polonia</li>
            <li>Partita IVA (NIP): 8762504246</li>
            <li>REGON: 524912675 – KRS: 0001028647</li>
            <li>Contatti: official@uranoecosystem.com – dpo@uranoecosystem.com</li>
          </Typography>
          <Typography variant="body1" paragraph>
            La Società è registrata come Virtual Asset Service Provider (VASP) ed è iscritta al Registro polacco delle attività in valuta virtuale, tenuto dal Direttore della Camera dell&apos;Amministrazione Fiscale di Katowice (Dyrektor Izby Administracji Skarbowej w Katowicach) e pubblicato ufficialmente su https://www.slaskie.kas.gov.pl/izba-administracji-skarbowej-w-katowicach/zalatwianie-spraw/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych/-/asset_publisher/R7Yl/content/rejestr-dzialalnosci-w-zakresie-walut-wirtualnych ai sensi della normativa nazionale antiriciclaggio.
          </Typography>
          <Typography variant="body1" paragraph>
            In previsione dell&apos;entrata in piena applicazione del Regolamento (UE) 2023/1114 (MiCA), la Società ha avviato la procedura di transizione verso la registrazione come Crypto Asset Service Provider (CASP).
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente adotta e mantiene un sistema interno di compliance che soddisfa i requisiti previsti in materia di antiriciclaggio (AML/CFT), secondo le raccomandazioni del FATF e le disposizioni del Regolamento generale sulla protezione dei dati (GDPR).
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            3. Finalità della presale
          </Typography>
          <Typography variant="body1" paragraph>
            La Presale ha lo scopo di distribuire una quota limitata del token $URANO a favore degli early supporters del progetto Urano Ecosystem.
          </Typography>
          <Typography variant="body1" paragraph>
            Il token $URANO è qualificato come utility token ai sensi del Regolamento (UE) 2023/1114 (MiCA) e non costituisce in alcun modo un titolo finanziario, uno strumento derivato, un e-money token, né un titolo rappresentativo di capitale o di debito.
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;obiettivo principale della Presale è raccogliere fondi destinati allo sviluppo dell&apos;infrastruttura Web3 di Urano, incluse le soluzioni DeFi, i moduli funzionali on-chain e i componenti dedicati alla tokenizzazione di asset del mondo reale (Real World Assets – RWA), promuovendo nel contempo l&apos;integrazione e l&apos;adozione della piattaforma all&apos;interno dell&apos;ecosistema Arbitrum.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            4. Uso dei fondi raccolti
          </Typography>
          <Typography variant="body1" paragraph>
            I fondi raccolti attraverso la Presale del token $URANO saranno destinati esclusivamente al perseguimento degli obiettivi strategici del progetto Urano Ecosystem e non saranno in alcun modo distribuiti a titolo di profitto ai membri fondatori, team o investitori precedenti. In particolare, le risorse raccolte verranno allocate secondo i seguenti ambiti:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Sviluppo e manutenzione dell&apos;infrastruttura tecnologica, inclusi aggiornamenti del protocollo, audit di sicurezza, pen-test, miglioramento dell&apos;esperienza utente e ottimizzazione del backend;</li>
            <li>Potenziamento delle misure di sicurezza informatica e della resilienza del protocollo agli attacchi informatici;</li>
            <li>Attività di marketing strategico, campagne pubblicitarie, brand awareness, gestione della community e formazione di partnership commerciali e istituzionali;</li>
            <li>Implementazione, evoluzione e manutenzione dei moduli funzionali uApp, uShares e uStation, e dei meccanismi di governance decentralizzata associati;</li>
            <li>Copertura dei costi di gestione, sviluppo, compresi quelli relativi alla compliance normativa, inclusi gli adempimenti legati al Regolamento MiCA (UE) 2023/1114, alla normativa antiriciclaggio (AML/CFT), e alle procedure di verifica dell&apos;identità (KYC);</li>
            <li>Espansione operativa nei mercati target sia dell&apos;Unione Europea che in Paesi terzi nel rispetto delle normative locali;</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            5. Caratteristiche del token $URANO
          </Typography>
          <Typography variant="body1" paragraph>
            Il token $URANO è classificato come utility token ai sensi dell&apos;Art. 3, par. 1, punto 5 del Regolamento (UE) 2023/1114 (MiCA), e viene emesso con finalità esclusivamente funzionali all&apos;interno dell&apos;ecosistema Urano. Le sue caratteristiche tecniche e funzionali sono le seguenti:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Nome del Token: URANO</li>
            <li>Ticker: $URANO</li>
            <li>Tipologia: Utility Token (non finanziario, non ibrido, non e-money token)</li>
            <li>Standard Tecnico: ERC-20</li>
            <li>Rete di Emissione: Arbitrum One (Layer 2 su Ethereum)</li>
            <li>Supply Totale: 1.000.000.000 $URANO (Supply limited, sistema di deflazione)</li>
            <li>Smart Contract: Auditato da provider indipendenti con report disponibile su https://www.uranoecosystem.com/audit</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Il token non conferisce alcun diritto patrimoniale o finanziario, né implica alcuna forma di rendimento garantito, distribuzione di dividendi, riacquisto o diritto partecipativo al capitale della società emittente. L&apos;unico ambito in cui il detentore può esercitare un&apos;influenza decisionale è la governance del protocollo.
          </Typography>
          <Typography variant="body1" paragraph>
            Il token non costituisce, ai sensi della normativa vigente:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>uno strumento finanziario ai sensi della Direttiva MiFID II (2014/65/UE);</li>
            <li>un titolo rappresentativo di capitale o debito;</li>
            <li>un e-money token ai sensi dell&apos;Art. 3(1)(7) MiCA;</li>
            <li>né un token collegato ad attività ai sensi dell&apos;Art. 3(1)(6) MiCA.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;indirizzo del contratto del token $URANO sarà reso pubblico e verificato su Arbiscan: www.arbiscan.io (l&apos;indirizzo esatto sarà comunicato al momento del deployment ufficiale e prima della distribuzione dei token).
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            6. Token Utility
          </Typography>
          <Typography variant="body1" paragraph>
            Il token $URANO rappresenta lo strumento nativo per l&apos;interazione con i moduli e i servizi dell&apos;ecosistema Urano. Esso è concepito unicamente come utility token ai sensi dell&apos;Art. 3(1)(5) e Art. 4 del Regolamento (UE) 2023/1114 (MiCA), e non possiede alcuna natura finanziaria, né comporta diritti di tipo patrimoniale o obbligazioni di rendimento.
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;uso del token è vincolato al superamento delle procedure di verifica dell&apos;identità (KYC), in conformità con la normativa AML/CFT vigente e tramite fornitori terzi autorizzati.
          </Typography>
          <Typography variant="body1" paragraph>
            Le principali funzionalità previste per il token $URANO includono:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Accesso ai servizi della piattaforma Urano: il possesso del token consente di interagire con moduli funzionali dell&apos;infrastruttura Urano, inclusi strumenti di visualizzazione, interazione e utilizzo di asset tokenizzati, nel rispetto delle condizioni indicate per ciascun modulo.</li>
            <li>Partecipazione alla governance DAO (staking richiesto): i titolari che mettono in staking i propri $URANO possono partecipare attivamente alla governance decentralizzata del protocollo, esercitando diritti di voto proporzionali su proposte strategiche, aggiornamenti e allocazione dei fondos DAO.</li>
            <li>Priorità di partecipazione a offerte di tokenizzazione: i possessori del token possono beneficiare di accesso prioritario alle operazioni di tokenizzazione di asset del mondo reale (RWA) effettuate attraverso la piattaforma uApp.</li>
            <li>Ricompense discrezionali per merito: il protocollo prevede forme di incentivazione non automatiche, assegnate in base a criteri di merito, partecipazione attiva, contributi tecnici e valore apportato alla community. Tali premi possono includere airdrop, assegnazioni o distribuzioni simboliche, riconoscimenti speciali approvati dalla governance.</li>
            <li>Interoperabilità con partner integrati: il token potrà essere utilizzato in futuro per interagire con servizi e protocolli di terze parti connessi all&apos;ecosistema Urano, ove tecnicamente e giuridicamente compatibile.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Le funzionalità sopra indicate saranno attivate progressivamente. L&apos;effettiva disponibilità di ciascuna funzione sarà annunciata mediante aggiornamenti ufficiali e documentazione accessoria. L&apos;utilizzo di tali funzioni sarà subordinato alla loro implementazione tecnica e al rispetto delle condizioni normative in vigore.
          </Typography>
          <Typography variant="body1" paragraph>
            Eventuali funzionalità aggiuntive, tra cui la possibilità di utilizzare il token $URANO come forma di collateralizzazionein moduli DeFi interni o esterni all&apos;ecosistema, rientrano negli obiettivi di sviluppo a medio termine del progetto. Tuttavia, tali utilizzi saranno esplicitamente regolamentati e resi pubblici solo in seguito a verifiche tecniche, audit indipendenti e conferma di piena conformità normativa, e non costituiscono, allo stato attuale, un impegno giuridicamente vincolante da parte dell&apos;Emittente.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            7. Tokenomics e allocazione
          </Typography>
          <Typography variant="body1" paragraph>
            La fornitura totale di $URANO è fissata a 1.000.000.000 token, suddivisi tra diverse categorie secondo il seguente schema di allocazione:
          </Typography>
          <Typography variant="body1" paragraph>
            Categoria | Token Allocati | % del Totale | Cliff (mesi) | Vesting (mesi) | Unlock TGE (%) | Token Unlock TGE
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
            Totale generale: 1.000.000.000 token – 100% dell&apos;offerta totale
          </Typography>
          <Typography variant="body1" paragraph>
            Token rilasciati al TGE: 40.980.000 (4,098%)
          </Typography>
          <Typography variant="body1" paragraph>
            Tutti i token sono gestiti tramite smart contract programmati per applicare automaticamente cliff, lock-up e vesting in modo trasparente. I contratti sono auditati da terze parti e saranno consultabili alla pagina: https://www.uranoecosystem.com/audit
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            8. Staking
          </Typography>
          <Typography variant="body1" paragraph>
            Il token $URANO potrà essere utilizzato, in una fase successiva allo sviluppo della piattaforma, per attività di staking on-chain, mediante moduli appositamente progettati e integrati nell&apos;infrastruttura di Urano.
          </Typography>
          <Typography variant="body1" paragraph>
            Lo staking consisterà nel vincolare una determinata quantità di token $URANO per un periodo predefinito, al fine di:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Ottenere ricompense periodiche in token;</li>
            <li>Accedere a funzionalità aggiuntive della piattaforma;</li>
            <li>Contribuire alla governance decentralizzata (in combinazione con lo staking);</li>
            <li>Rafforzare la stabilità dell&apos;ecosistema incentivando la partecipazione di lungo periodo.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Le funzionalità previste, soggette a successivo rilascio, potranno includere:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Definizione di periodi minimi di blocco (locking period);</li>
            <li>Calcolo di percentuali di rendimento variabili (APY), legate al modulo di staking selezionato, al numero di token in staking, alla liquidità stanziata e alla durata dell&apos;impegno;</li>
            <li>Eventuali meccanismi de revoca anticipata, soggetti a penalità e tempi di sblocco;</li>
            <li>Verifica obbligatoria dell&apos;identità (KYC) per accedere al servizio, in conformità alle normative AML/CFT;</li>
            <li>Compatibilità con protocolli DeFi e potenziale integrazione con partner esterni selezionati.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Tutti i dettagli tecnici, i termini contrattuali e le modalità operative relativi allo staking saranno resi disponibili in un&apos;apposita sezione dedicata sul sito ufficiale:
          </Typography>
          <Typography variant="body1" paragraph>
            https://www.uranoecosystem.com/staking
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;adesione al servizio di staking sarà sempre su base volontaria e subordinata all&apos;accettazione delle condizioni specifiche pubblicate al momento del rilascio.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            9. Governance Decentralizzata (DAO)
          </Typography>
          <Typography variant="body1" paragraph>
            Il protocollo Urano integra un sistema di governance decentralizzato (DAO), progettato per garantire trasparenza, inclusività e partecipazione attiva da parte della community.
          </Typography>
          <Typography variant="body1" paragraph>
            I detentori del token $URANO potranno, attraverso meccanismi on-chain, proporre e votare sulle seguenti aree:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Iniziative strategiche relative all&apos;evoluzione della piattaforma;</li>
            <li>Allocazione delle risorse provenienti dal Treasury DAO;</li>
            <li>Definizione o modifica della roadmap di sviluppo;</li>
            <li>Selezione e approvazione di integrazioni tecniche o partnership strategiche;</li>
            <li>Attivazione o modifica di moduli funzionali.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            Requisiti di partecipazione
          </Typography>
          <Typography variant="body1" paragraph>
            La partecipazione attiva alla governance è condizionata dai seguenti requisiti:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Staking dei token $URANO: solo gli utenti che mettono in staking i propri token potranno votare e proporre iniziative.</li>
            <li>Regola base: 1 $URANO in staking = 1 voto on-chain</li>
            <li>Verifica dell&apos;identità (KYC): in conformità con le normative AML/CFT, è obbligatorio completare la verifica dell&apos;identità tramite provider certificato per accedere al modulo de governance.</li>
            <li>Wallet compatibile: le interazioni avverranno tramite smart contract verificabili e auditati, accessibili da wallet supportati.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            Sistema di ricompense (utility-based)
          </Typography>
          <Typography variant="body1" paragraph>
            Al fine di incentivare un coinvolgimento qualitativo, il protocollo prevede un sistema di ricompense non automatiche, assegnate su base meritocratica, tra cui:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Premi periodici in token o badge reputazionali per i key contributors;</li>
            <li>Accesso privilegiato a testnet, moduli beta o ruoli operativi per chi elabora o supporta proposte significative;</li>
            <li>In futuro, eventuali riconoscimenti attribuiti dalla DAO sulla base di KPI condivisi.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            Meccanismo di voto
          </Typography>
          <Typography variant="body1" paragraph>
            • Non è previsto un quorum minimo per la validità delle votazioni, al fine di favorire la fluidità e la rapidità decisionale;
            • Ogni proposta sarà soggetta a una scadenza temporale predefinita (es. 5 o 7 giorni) entro cui sarà possibile votare;
            • Al termine del periodo stabilito, la proposta sarà automaticamente approvata o respinta in base ai voti espressi.
          </Typography>
          <Typography variant="body1" paragraph>
            Le regole di governance e il modello di voto saranno regolati da smart contract auditati, e descritti nei documenti tecnici ufficiali.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            10. Meccanismi di Trasparenza e Audit
          </Typography>
          <Typography variant="body1" paragraph>
            Al fine di garantire un elevato livello di accountability, sicurezza e compliance normativa, l&apos;Emittente ha implementato un framework strutturato di trasparenza e controllo pubblico, articolato nei seguenti componenti:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Audit tecnici indipendenti:
            Tutti gli smart contract utilizzati per la gestione della tokenomics, dello staking, della governance e di altri moduli funzionali sono sottoposti ad audit esterni da parte di provider terzi certificati. I relativi report di sicurezza sono pubblicamente consultabili al seguente indirizzo: uranoecosystem.com/audit</li>
            <li>Tracciabilità on-chain e accountability DAO:
            Le attività della treasury e le decisioni assunte tramite governance DAO sono documentate e pubblicate tramite report periodici, accessibili in formato digitale attraverso la sezione dedicata della piattaforma. La registrazione on-chain delle transazioni garantisce la non modificabilità e la verificabilità pubblica di ogni operazione.</li>
            <li>Repository GitHub ufficiale:
            L&apos;intero codice del protocollo (in versione pubblicabile) è ospitato in un repository GitHub ufficiale, comprensivo di:
            o Changelog versionato con indicazione puntuale delle modifiche;
            o Documentazione tecnica dei moduli chiave;
            o Meccanismi di proposta e gestione delle pull request</li>
            <li>Strumenti analitici e dashboard pubblici:
            Il monitoraggio delle metriche chiave (allocazioni, transazioni, wallet attivi, burn events, emissioni, governance) è assicurato tramite dashboard pubbliche alimentate da fonti on-chain affidabili (es. Dune, Arkham, Flipside, o soluzioni personalizzate). Questi strumenti permettono agli utenti e agli investitori di verificare in tempo reale le performance e la coerenza del protocollo.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Tale struttura risponde ai principi di trasparenza finanziaria, auditabilità tecnica e supervisione comunitaria previsti sia dalle linee guida di settore che dalle più recenti normative europee applicabili in materia di crypto-asset.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            11. Limitazioni di accesso e restrizioni giurisdizionali
          </Typography>
          <Typography variant="body1" paragraph>
            La partecipazione alla Presale e l&apos;accesso alla Piattaforma Urano sono soggetti a restrizioni geografiche, normative e soggettive, finalizzate al rispetto delle leggi applicabili in materia di prevenzione del riciclaggio di denaro (AML), finanziamento del terrorismo (CFT), sanzioni internazionali e compliance con i requisiti del Regolamento (UE) 2023/1114 (MiCA).
          </Typography>
          <Typography variant="body1" paragraph>
            È espressamente vietata la partecipazione alla Presale e/o l&apos;interazione con i servizi della Piattaforma Urano da parte di:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Persone fisiche o giuridiche residenti, domiciliate o aventi sede legale in giurisdizioni soggette a restrizioni o sanzioni internazionali, tra cui a titolo esemplificativo e non esaustivo:
            Stati Uniti d&apos;America, Regno Unito, Canada, Repubblica Popolare Cinese, Corea del Nord, Iran, Siria, Russia, nonché qualsiasi Stato soggetto a embargo o limitazioni imposte da UE, ONU, OFAC o FATF;</li>
            <li>Soggetti PEP (Politically Exposed Persons), ovvero persone esposte politicamente ai sensi della normativa AML/CFT vigente, e i relativi familiari o soggetti connessi;</li>
            <li>Utenti che accedono alla piattaforma tramite strumenti di anonimizzazione, tra cui VPN, proxy, browser Tor o altri mezzi tecnici volti ad occultare l&apos;identità o la localizzazione;</li>
            <li>Persone fisiche o giuridiche incluse in liste di sanzioni nazionali, europee o internazionali, come quelle pubblicate da OFAC (Office of Foreign Assets Control), Consiglio dell&apos;Unione Europea, Organizzazione delle Nazioni Unite (ONU) o altri organismi competenti.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            In caso di violazione delle presenti restrizioni, l&apos;Emittente si riserva il diritto, a propria esclusiva discrezione e senza obbligo di preavviso, di:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Bloccare o limitare l&apos;accesso alla piattaforma;</li>
            <li>Sospendere o chiudere l&apos;account dell&apos;utente;</li>
            <li>Annullare la partecipazione alla Presale e la relativa allocazione de token;</li>
            <li>Trasmettere le informazioni alle autorità competenti ove richiesto dalla legge.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;utente è tenuto a dichiarare sotto la propria responsabilità la propria idoneità alla partecipazione e a verificare la conformità con le leggi del proprio Paese di residenza o domicilio, manlevando l&apos;Emittente da ogni responsabilità in caso di violazione.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            12. Dichiarazioni e garanzie dell&apos;utente (Representations & Warranties)
          </Typography>
          <Typography variant="body1" paragraph>
            Con l&apos;adesione alla Presale e l&apos;accettazione dei presenti Termini, l&apos;Utente dichiara e garantisce, sotto la propria esclusiva responsabilità, quanto segue:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Di avere almeno diciotto (18) anni e di essere legalmente capace ai sensi della legge del proprio Stato di residenza o cittadinanza;</li>
            <li>Di non essere cittadino, residente, domiciliato o costituito secondo le leggi di una giurisdizione soggetta a restrizioni (cfr. Sezione 11), né di agire per conto o in rappresentanza di soggetti ivi localizzati;</li>
            <li>Di non figurare in alcuna lista di sanzioni internazionali, né di agire per conto di persone fisiche o giuridiche oggetto di sanzioni internazionali, restrizioni normative o segnalazioni AML/CFT;</li>
            <li>Di agire esclusivamente in nome proprio, in qualità di beneficiario effettivo dell&apos;eventuale acquisto di token, e non come agente, fiduciario, rappresentante o mandatario per conto di terzi;</li>
            <li>Di disporre della piena capacità giuridica, dei diritti e dei poteri necessari per stipulare un contratto legalmente vincolante con l&apos;Emittente;</li>
            <li>Di aver letto, compreso e accettato integralmente i presenti Termini e ogni documento contrattuale correlato, inclusi la Privacy Policy e la Cookie Policy della piattaforma;</li>
            <li>Di comprendere pienamente la natura del token $URANO, incluso il fatto che si tratti di un utility token ai sensi del Regolamento (UE) 2023/1114 (MiCA), privo di valore legale garantito, e soggetto alla volatilità tipica dei mercati crypto;</li>
            <li>Di assumersi ogni rischio connesso all&apos;acquisto, detenzione, trasferimento o utilizzo del token, riconoscendone l&apos;elevato grado di incertezza e la potenziale perdita totale del valore investito;</li>
            <li>Di essere l&apos;unico soggetto responsabile del rispetto della normativa fiscale, civilistica e finanziaria applicabile nel proprio ordinamento giuridico di riferimento, incluse eventuali obbligazioni dichiarative o di versamento nei confronti delle autorità fiscali competenti.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            Clausola di responsabilità:
          </Typography>
          <Typography variant="body1" paragraph>
            Il mancato rispetto anche di una sola delle dichiarazioni e garanzie sopra riportate costituisce violazione sostanziale dei presenti Termini e potrà comportare, a esclusiva discrezione dell&apos;Emittente, l&apos;annullamento dell&apos;accesso alla Presale, la revoca dell&apos;allocazione dei token e/o la trasmissione dei dati alle autorità competenti, nei limiti consentiti dalla normativa applicabile.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            13. Rinuncia, recesso e revoca dell&apos;Offerta
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            13.1 Diritto di recesso (ai sensi del Regolamento MiCA)
          </Typography>
          <Typography variant="body1" paragraph>
            Conformemente all&apos;Articolo 13 del Regolamento (UE) 2023/1114 (&quot;MiCA&quot;), l&apos;Utente che partecipa alla Presale in qualità di persona fisica e agisce per scopi estranei alla propria attività imprenditoriale, commerciale, artigianale o professionale (retail holder) ha diritto di recedere dal contratto di acquisto dei token $URANO entro 14 (quattordici) giorni dalla data de completamento della transazione (data di ricezione dei fondi da parte dell&apos;Emittente), senza necessità di indicarne i motivi e senza penalità.
          </Typography>
          <Typography variant="body1" paragraph>
            La comunicazione del recesso potrà essere trasmessa:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>via email all&apos;indirizzo ufficiale: official@uranoecosystem.com;</li>
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente, una volta ricevuta una comunicazione di recesso valida e tempestiva, provvederà a rimborsare integralmente i fondi versati, incluse eventuali commissioni di transazione trattenute dalla piattaforma, entro 14 (quattordici) giorni lavorativi dalla ricezione della richiesta, utilizzando lo stesso mezzo di pagamento usato per l&apos;acquisto, salvo diversa richiesta espressa da parte dell&apos;Utente.
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            13.2 Esclusioni dal diritto di recesso
          </Typography>
          <Typography variant="body1" paragraph>
            Il diritto di recesso non sarà più esercitabile nei seguenti casi:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>qualora il token $URANO sia stato ammesso al trading su una piattaforma di scambio regolamentata o MTF, prima della comunicazione di recesso;</li>
            <li>qualora siano scaduti i termini previsti per l&apos;esercizio del diritto di recesso, ai sensi dell&apos;Articolo 13, paragrafo 5, del Regolamento MiCA;</li>
            <li>nel caso in cui il prodotto sia stato personalizzato o configurato secondo richieste specifiche dell&apos;Utente tali da rientrare nelle eccezioni previste per i beni digitali.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            13.3 Revoca dell&apos;offerta da parte dell&apos;Emittente
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente si riserva il diritto, in qualsiasi momento, di revocare, sospendere, modificare o interrompere l&apos;offerta di Presale, con o senza preavviso, nei seguenti casi:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>sopravvenienza di eventi di forza maggiore;</li>
            <li>mutamenti normativi, fiscali o regolamentari che impattino l&apos;operatività della Presale;</li>
            <li>evidenza di rischi per la sicurezza, frodi, comportamenti dolosi o uso illecito;</li>
            <li>valutazioni reputazionali, tecniche o di opportunità strategica.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            In tali casi, l&apos;Emittente si impegna a valutare, ove tecnicamente ed economicamente possibile, forme di rimborso parziale o integrale a favore degli utenti che abbiano partecipato alla Presale e che risultino danneggiati da tale revoca.
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            13.4 Esclusione di responsabilità per errori imputabili all&apos;utente
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente non sarà responsabile per la mancata ricezione dei token o per altre conseguenze derivanti da:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>errori nella compilazione dei dati da parte dell&apos;Utente;</li>
            <li>uso improprio di strumenti di pagamento;</li>
            <li>accesso non autorizzato al wallet dell&apos;Utente;</li>
            <li>violazioni delle presenti condizioni.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Nessun rimborso sarà dovuto in tali circostanze, e la responsabilità rimarrà integralmente in capo all&apos;Utente.
          </Typography>
          <Typography variant="body1" paragraph>
            • per motivi tecnici imputabili all&apos;Utente, non sarà previsto rimborso.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            14. Forza maggiore e limitazioni di responsabilità
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente non potrà essere ritenuto responsabile per eventuali ritardi, interruzioni, malfunzionamenti, omissioni o inadempimenti derivanti da eventi di forza maggiore, incluso – ma non limitato a – guerre, sommosse, atti terroristici, calamità naturali, pandemie, blackout energetici, scioperi, attacchi informatici, malfunzionamenti della rete blockchain o delle infrastrutture tecnologiche di terzi.
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Utente riconosce e accetta espressamente che:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>L&apos;acquisto e la detenzione del token $URANO comportano rischi significativi, inclusa la possibilità di perdita totale del capitale investito;</li>
            <li>Il token $URANO non gode di alcuna garanzia di valore presente o futura, né rappresenta un diritto di rivendita, rimborso o utilizzo obbligatorio all&apos;interno o all&apos;esterno della Piattaforma Urano;</li>
            <li>L&apos;Emittente non fornisce garanzie di tipo economico, legale o fiscale relativamente al token, ai servizi, né al funzionamento ininterrotto o privo di errori della Piattaforma;</li>
            <li>La responsabilità dell&apos;Emittente, in ogni caso e per qualsiasi causa, sarà limitata all&apos;importo effettivamente versato dall&apos;Utente nell&apos;ambito della Presale, al netto di eventuali costi tecnici, di rete o transazionali;</li>
            <li>In nessun caso l&apos;Emittente potrà essere ritenuto responsabile per danni indiretti, speciali, incidentali, punitivi o consequenziali, compresi – a titolo esemplificativo – la perdita di profitti, di dati, di reputazione o di opportunità economiche.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            La presente limitazione di responsabilità si applica nella misura massima consentita dalla legge applicabile, senza pregiudicare eventuali diritti inderogabili riconosciuti all&apos;Utente in qualità di consumatore, laddove applicabile.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            15. Avvertenza sui rischi (Risk Disclosure)
          </Typography>
          <Typography variant="body1" paragraph>
            La partecipazione alla Presale del token $URANO comporta rischi rilevanti di natura tecnica, giuridica, finanziaria e operativa. L&apos;Utente, mediante l&apos;adesione alla Presale, riconosce e accetta integralmente quanto segue:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Rischio Tecnologico: L&apos;ecosistema Urano si basa su smart contract, protocolli decentralizzati e infrastrutture tecnologiche soggette a potenziali vulnerabilità, bug, exploit informatici o attacchi esterni. Eventuali errori nel codice o falle nella sicurezza possono causare perdita totale o parziale dei fondi.</li>
            <li>Rischio Regolamentare: Il contesto normativo di riferimento per gli asset digitali è in costante evoluzione. Interventi normativi, decisioni regolatorie o nuove interpretazioni delle autorità competenti (inclusa l&apos;ESMA o autorità nazionali) possono influenzare la legalità, usabilità o trasferibilità del token $URANO, anche retroattivamente.</li>
            <li>Rischio Finanziario e di Mercato: I token crypto, inclusi gli utility token, sono soggetti a forte volatilità, scarsa liquidità e dinamiche speculative. Il valore del token $URANO può variare significativamente nel tempo, senza alcuna garanzia di crescita, stabilità o recuperabilità dell&apos;importo versato.</li>
            <li>Rischio di Interoperabilità: Il token $URANO è basato sullo standard ERC-20 e opera su Arbitrum One. Eventuali modifiche o incompatibilità con bridge, wallet, exchange o protocolli DeFi possono limitare l&apos;interazione o il trasferimento del token all&apos;interno o all&apos;esterno dell&apos;ecosistema Urano.</li>
            <li>Rischio di Controparte: Alcune funzionalità potrebbero dipendere da fornitori terzi (es. servizi di custodia, wallet, fornitori KYC, exchange, piattaforme de bridge cross-chain). Il fallimento, frode o inattività di tali soggetti può compromettere l&apos;accesso ai servizi o causare perdite.</li>
            <li>Rischio Legale Individuale: L&apos;Emittente non effettua consulenza legale o fiscale individuale. L&apos;Utente è l&apos;unico responsabile della verifica della conformità alla normativa nazionale, incluse le disposizioni su fiscalità, antiriciclaggio, segnalazioni e divieti specifici nel proprio Stato di residenza o cittadinanza.</li>
            <li>Rischio di Perdita delle Chiavi Private: L&apos;accesso ai token $URANO richiede la corretta gestione di chiavi private o seed phrase. La perdita o la compromissione di tali credenziali comporta l&apos;impossibilità definitiva di accedere ai token, senza alcuna possibilità di recupero da parte dell&apos;Emittente.</li>
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            Clausola finale:
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente raccomanda vivamente a ciascun Utente di consultare un avvocato, un esperto di normativa crypto e un consulente finanziario indipendente prima di partecipare alla Presale o utilizzare i servizi connessi al token $URANO.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            16. Conformità regolamentare (MiCA e AML)
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Emittente si impegna a operare in piena conformità con il Regolamento (UE) 2023/1114 (&quot;MiCA&quot;) e con le normative europee e nazionali in materia di prevenzione del riciclaggio di denaro e contrasto al finanziamento del terrorismo (&quot;AML/CFT&quot;), adottando un approccio proattivo alla gestione dei rischi de compliance. In particolare:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Il token $URANO è classificato como utility token ai sensi dell&apos;art. 3(1)(5) MiCA e non rientra tra gli e-money token (art. 3(1)(7)) né tra gli asset-referenced token (art. 3(1)(6)). Non rappresenta uno strumento finanziario né un titolo di debito o capitale.</li>
            <li>I presenti Termini e Condizioni integrano le informazioni precontrattuali obbligatorie previste dagli articoli 6 e 7 MiCA, incluse: natura e funzionalità del token, diritti e obblighi delle parti, rischi rilevanti, modalità di offerta, meccanismi di tracciabilità e condizioni di accesso.</li>
            <li>L&apos;accesso alla Presale e ai servizi della piattaforma Urano è subordinato al completamento di un processo di verifica dell&apos;identità (KYC) conforme ai requisiti della normativa AML/CFT, in linea con quanto previsto dal Regolamento (UE) 2023/1113, Direttiva (UE) 2015/849 e successive modifiche.</li>
            <li>È vietata la partecipazione da parte di soggetti non identificati, anonimizzati o residenti in giurisdizioni ad alto rischio o sottoposte a restrizioni internazionali. Ogni operazione sospetta sarà soggetta a procedura de analisi e, ove necessario, a segnalazione alle autorità competenti.</li>
            <li>L&apos;Emittente adotta misure volte a prevenire e contrastare pratiche abusive, inclusi:
            • Abusi di mercato e manipolazioni del prezzo (articoli 86–92 MiCA);
            • Insider trading e uso indebito di informazioni privilegiate (art. 89 MiCA);
            • Frodi, attività illecite o inganni nei confronti degli utenti (art. 92 MiCA).</li>
            <li>Tutti i dati raccolti nell&apos;ambito delle verifiche KYC/AML saranno conservati per un periodo minimo di 5 anni nel rispetto delle normative GDPR e dei principi de minimizzazione, integrità e riservatezza.</li>
            <li>L&apos;Emittente dichiara sin d&apos;ora la propria volontà ad adeguarsi automaticamente alla disciplina applicabile ai Crypto Asset Service Provider (CASP) secondo le disposizioni del Titolo V MiCA e delle norme attuative nazionali, adottando i requisiti patrimoniali, de governance e operativi previsti.</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            17. Disposizioni transitorie
          </Typography>
          <Typography variant="body1" paragraph>
            Durante il periodo di transizione tra lo status attuale di fornitore di servizi relativi a valute virtuali (VASP), ai sensi della normativa nazionale vigente, e la futura registrazione ufficiale come Crypto Asset Service Provider (CASP) conformemente al Regolamento (UE) 2023/1114 (&quot;MiCA&quot;), l&apos;Emittente si impegna ad applicare in via volontaria e anticipata i principi fondamentali previsti dalla normativa europea di riferimento. In particolare:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Il divieto di pubblicità ingannevole, a tutela della corretta informazione dell&apos;Utente e dell&apos;integrità del mercato;</li>
            <li>L&apos;obbligo di trasparenza, mediante l&apos;accesso pubblico e comprensibile alle caratteristiche del token, alle condizioni dell&apos;offerta e alle funzionalità disponibili sulla piattaforma;</li>
            <li>L&apos;adozione di misure di protezione degli utenti finali, inclusa la gestione dei reclami e l&apos;assistenza informativa pre e post-acquisto;</li>
            <li>L&apos;implementazione di politiche interne de sicurezza operativa e informatica, conformi agli standard di settore e alle raccomandazioni delle autorità competenti;</li>
            <li>La registrazione e tracciabilità delle operazioni rilevanti, in conformità con gli obblighi AML/CFT e la normativa GDPR.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Al completamento della procedura de registrazione come CASP presso l&apos;autorità competente, i presenti Termini e Condizioni saranno oggetto di aggiornamento per riflettere l&apos;integrale adeguamento alla disciplina definitiva applicabile ai fornitori di servizi su crypto-asset.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            18. Clausole finali
          </Typography>
          <Typography variant="body1" paragraph>
            Ai sensi dell&apos;articolo 6 del Regolamento (UE) 2023/1114 (&quot;MiCA&quot;), l&apos;Emittente dichiara che i presenti Termini e Condizioni contengono tutte le informazioni obbligatorie richieste per l&apos;offerta pubblica de utility token, tra cui:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Le caratteristiche essenziali del token $URANO;</li>
            <li>I rischi principali connessi all&apos;acquisto e alla detenzione;</li>
            <li>I diritti e gli obblighi delle parti;</li>
            <li>Le condizioni economiche dell&apos;offerta;</li>
            <li>Le finalità e lo stato di sviluppo del progetto Urano Ecosystem;</li>
            <li>I canali ufficiali di comunicazione dell&apos;Emittente.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            In aggiunta, si specifica quanto segue:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>L&apos;invalidità, l&apos;illiceità o l&apos;inefficacia di una qualunque disposizione dei presenti Termini non pregiudicherà la validità e l&apos;efficacia delle altre clausole, che rimarranno pienamente vincolanti tra le parti;</li>
            <li>I presenti Termini e Condizioni sono disciplinati dal diritto sostanziale della Repubblica di Polonia, senza pregiudizio per eventuali norme imperative di protezione del consumatore previste da altre normative europee applicabili;</li>
            <li>Per ogni controversia relativa all&apos;interpretazione, esecuzione o validità dei presenti Termini sarà competente in via esclusiva il foro de Varsavia (Polonia), salvo diversa disposizione inderogabile di legge;</li>
            <li>L&apos;Emittente si riserva il diritto di aggiornare, modificare o integrare in qualsiasi momento i presenti Termini, al fine di riflettere evoluzioni normative, tecniche o operative. Le modifiche entreranno in vigore al momento della loro pubblicazione sulla landing page ufficiale: https://www.uranoecosystempresale.com/terms.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            L&apos;Utente è tenuto a consultare periodicamente tale indirizzo per prendere visione della versione aggiornata e vincolante dei Termini.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            19. Glossario
          </Typography>
          <Typography variant="body1" paragraph>
            DAO (Decentralized Autonomous Organization): struttura organizzativa decentralizzata basata su smart contract, in cui le decisioni vengono prese collettivamente dai membri mediante votazioni on-chain, secondo regole predefinite e trasparenti.
          </Typography>
          <Typography variant="body1" paragraph>
            KYC (Know Your Customer): procedura obbligatoria de identificazione e verifica dell&apos;identità degli utenti, finalizzata alla prevenzione di attività illecite, in conformità alle normative AML/CFT applicabili.
          </Typography>
          <Typography variant="body1" paragraph>
            AML (Anti Money Laundering): insieme de norme e procedure volte alla prevenzione e al contrasto del riciclaggio di denaro, disciplinate da direttive europee e normative nazionali.
          </Typography>
          <Typography variant="body1" paragraph>
            MiCA (Markets in Crypto-Assets Regulation): Regolamento (UE) 2023/1114 del Parlamento europeo e del Consiglio, che disciplina l&apos;offerta e la prestazione di servizi relativi ai crypto-asset nel mercato unico europeo.
          </Typography>
          <Typography variant="body1" paragraph>
            Utility Token: tipologia de token crittografico che consente l&apos;accesso a determinati servizi, funzionalità o benefici all&apos;interno di una piattaforma, senza attribuire diritti patrimoniali o di investimento, ai sensi dell&apos;art. 3(1)(5) del Regolamento MiCA.
          </Typography>
          <Typography variant="body1" paragraph>
            Wallet: portafoglio digitale, custodiale o non-custodial, utilizzato per detenere, ricevere e trasferire crypto-asset sulla blockchain.
          </Typography>
          <Typography variant="body1" paragraph>
            Smart Contract: codice informatico auto-eseguibile distribuito su blockchain, che consente l&apos;automatizzazione de transazioni e interazioni tra utenti senza bisogno di intermediari.
          </Typography>
          <Typography variant="body1" paragraph>
            Tokenomics: disciplina che descrive la struttura economica, la distribuzione, la circolazione e gli incentivi legati a un token all&apos;interno di un ecosistema crittografico.
          </Typography>

          <Divider sx={{ my: 4 }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            Ultimo aggiornamento: Luglio 2025
          </Typography>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}