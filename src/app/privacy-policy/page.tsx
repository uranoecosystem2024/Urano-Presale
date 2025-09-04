import { Stack, Typography, Link, List, ListItem} from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
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
      <Stack flex={1} sx={{ p: { xs: 3, md: 9 } }} py={4} justifyContent="start" gap={{xs: 2, lg: 4}}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Informativa sulla Privacy della Landing Page della Presale Urano Ecosystem
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          1. Titolare del trattamento
        </Typography>
        <Typography variant="body1" gutterBottom>
          Ai sensi del Regolamento (UE) 2016/679 (&quot;GDPR&quot;) e delle normative applicabili in materia di protezione dei dati personali, il Titolare del trattamento è:
        </Typography>
        <List dense>
          <ListItem>URANO ECOSYSTEM Sp. Z o.o.</ListItem>
          <ListItem>Sede legale: ul. Mickiewicza 39A/3, 86-300 Grudziądz (Kujawsko-Pomorskie), Poland</ListItem>
          <ListItem>Numero di registrazione (KRS): 0001028647</ListItem>
          <ListItem>REGON: 524912675</ListItem>
          <ListItem>Partita IVA (NIP): 8762504246</ListItem>
          <ListItem>Email di contatto: official@uranoecosystem.com</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Il Titolare ha nominato un Data Protection Officer (DPO), raggiungibile all&apos;indirizzo: dpo@uranoecosystem.com
        </Typography>
        <Typography variant="body1" gutterBottom>
          Il trattamento dei dati personali avviene anche in conformità con gli obblighi previsti dal Regolamento (UE) 2023/1114 (MiCA) in materia di offerte di crypto-asset, con particolare attenzione alle disposizioni relative all&apos;identificazione degli utenti (KYC), alla trasparenza informativa e alla prevenzione di abusi di mercato.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          2. Finalità del trattamento
        </Typography>
        <Typography variant="body1" gutterBottom>
          I dati personali raccolti tramite la landing page della Presale del token $URANO sono trattati per le seguenti finalità:
        </Typography>
        <List dense>
          <ListItem>• F1. Erogazione dei servizi: permettere la registrazione alla Presale e fornire contenuti informativi sul progetto Urano Ecosystem;</ListItem>
          <ListItem>• F2. Verifica dell&apos;identità (KYC): procedere alla verifica dell&apos;identità e dell&apos;età degli utenti, in conformità alla normativa AML/CFT e MiCA;</ListItem>
          <ListItem>• F3. Gestione amministrativa, tecnica e di sicurezza: assicurare il corretto funzionamento della piattaforma, prevenirne l&apos;abuso e garantirne la sicurezza informatica e operativa;</ListItem>
          <ListItem>• F4. Adempimenti normativi e fiscali: rispettare obblighi di legge e normative settoriali applicabili, inclusi quelli in materia di prevenzione del riciclaggio, antiterrorismo e trasparenza nei mercati crypto;</ListItem>
          <ListItem>• F5. Comunicazioni obbligatorie: inviare notifiche relative a modifiche dei Termini, delle Policy o aggiornamenti legali, laddove necessario;</ListItem>
          <ListItem>• F6. Tutela dei diritti del Titolare: esercitare o difendere un diritto in sede giudiziaria o stragiudiziale.</ListItem>
        </List>
        
        <Typography variant="h6" component="h2" gutterBottom>
          Basi giuridiche del trattamento
        </Typography>
        <Typography variant="body1" gutterBottom>
          Il trattamento dei dati personali da parte di Urano Ecosystem si fonda sulle seguenti basi giuridiche, ai sensi dell&apos;articolo 6 del GDPR:
        </Typography>
        <List dense>
          <ListItem>• Esecuzione di un contratto o di misure precontrattuali – ex art. 6(1)(b) GDPR: il trattamento è necessario per consentire l&apos;accesso dell&apos;utente alla Presale, per fornire i servizi connessi e per adempiere alle richieste precontrattuali da parte dell&apos;utente;</ListItem>
          <ListItem>• Adempimento di obblighi legali – ex art. 6(1)(c) GDPR: in particolare in relazione alla normativa antiriciclaggio (AML/CFT), alla normativa fiscale applicabile e agli obblighi previsti dal Regolamento (UE) 2023/1114 (MiCA), che richiedono l&apos;identificazione dell&apos;utente e la tracciabilità delle operazioni rilevanti;</ListItem>
          <ListItem>• Legittimo interesse del Titolare – ex art. 6(1)(f) GDPR: relativo alla prevenzione di frodi, alla sicurezza informatica, al monitoraggio tecnico della piattaforma e alla protezione dei diritti legali del Titolare, anche in sede giudiziale o amministrativa. Tali interessi sono bilanciati rispetto ai diritti e alle libertà fondamentali dell&apos;interessato;</ListItem>
          <ListItem>• Consenso esplicito dell&apos;interessato – ex art. 6(1)(a) GDPR: richiesto, ove necessario, ad esempio per il trattamento di categorie particolari di dati (come dati biometrici gestiti dal provider KYC) o per l&apos;invio di comunicazioni opzionali. In ogni caso, il consenso è sempre revocabile in qualsiasi momento.</ListItem>
        </List>
        
        <Typography variant="h6" component="h2" gutterBottom>
          Restrizione di età
        </Typography>
        <Typography variant="body1" gutterBottom>
          L&apos;accesso alla Presale è riservato esclusivamente a utenti maggiorenni (18+). Urano Ecosystem non raccoglie né tratta intenzionalmente dati personali relativi a minori. Eventuali dati accidentalmente raccolti saranno cancellati tempestivamente.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          3. Modalità di raccolta dei dati personali nella presale
        </Typography>
        <Typography variant="body1" gutterBottom>
          I dati personali vengono raccolti direttamente dall&apos;utente in varie fasi della Presale. Al momento della registrazione, richiediamo e trattiamo dati identificativi (nome, cognome) e di contatto (indirizzo email). Per adempiere agli obblighi legali e di sicurezza (inclusi AML/CFT e MiCA), l&apos;utente viene reindirizzato alla piattaforma del nostro fornitore esterno, Persona Identities, Inc., per la verifica dell&apos;identità (KYC). Durante questa procedura, Persona raccoglie direttamente i dati necessari, come documenti d&apos;identità, dati di contatto, e potenzialmente dati biometrici con il consenso dell&apos;utente, senza che noi li trattiamo o conserviamo direttamente. Infine, per consentire la partecipazione alla Presale, Urano Ecosystem riceve unicamente l&apos;indirizzo pubblico del wallet blockchain dell&apos;utente e i metadati tecnici, come l&apos;esito della verifica (verificato/non verificato), un identificativo univoco e una marca temporale della verifica. In aggiunta, dati di navigazione come l&apos;indirizzo IP vengono raccolti automaticamente a fini di sicurezza e per il corretto funzionamento della piattaforma.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          4. Tipologia di dati trattati
        </Typography>
        <Typography variant="body1" gutterBottom>
          Nel contesto della registrazione e partecipazione alla Presale, nonché della semplice navigazione sulla landing page, Urano Ecosystem può trattare le seguenti categorie di dati personali:
        </Typography>
        <List dense>
          <ListItem>• a. Dati identificativi: nome, cognome, e altri dati richiesti in fase di registrazione o verifica dell&apos;identità;</ListItem>
          <ListItem>• b. Dati di contatto: indirizzo email fornito dall&apos;utente;</ListItem>
          <ListItem>• c. Dati de verifica KYC: esito della verifica (verificato/non verificato), identificativo univoco della transazione, marca temporale, codice paese, e metadati tecnici forniti dal provider Persona;</ListItem>
          <ListItem>• d. Indirizzo del wallet blockchain: indirizzo pubblico associato al wallet dell&apos;utente, utilizzato ai fini della partecipazione alla Presale e della verifica dell&apos;idoneità;</ListItem>
          <ListItem>• e. Dati di navigazione e tecnici: indirizzo IP, user agent (browser/dispositivo), orari di accesso, referrer e log di sistema, raccolti automaticamente per finalità di sicurezza e statistica;</ListItem>
          <ListItem>• f. Dati forniti volontariamente: eventuali ulteriori informazioni comunicate spontaneamente dall&apos;utente nei moduli presenti sul sito (es. richieste di contatto, commenti, suggerimenti).</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Nota: Urano Ecosystem non raccoglie né tratta direttamente documenti d&apos;identità o dati biometrici. Tali informazioni, se richieste, sono gestite in maniera autonoma e sicura dal fornitore esterno Persona Identities, Inc., come specificato nel paragrafo dedicato alla verifica dell&apos;identità.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          5. Base giuridica del trattamento
        </Typography>
        <Typography variant="body1" gutterBottom>
          Il trattamento dei dati personali da parte di Urano Ecosystem è fondato su diverse basi giuridiche, a seconda delle specifiche finalità perseguite:
        </Typography>
        <List dense>
          <ListItem>• a. Esecuzione di un contratto o di misure precontrattuali – ex art. 6(1)(b) GDPR: il trattamento è necessario per consentire l&apos;accesso dell&apos;utente alla Presale, per fornire i servizi connessi e per adempiere alle richieste precontrattuali da parte dell&apos;utente;</ListItem>
          <ListItem>• b. Adempimento di obblighi legali – ex art. 6(1)(c) GDPR: in particolare in relazione alla normativa antiriciclaggio (AML/CFT), alla normativa fiscale applicabile e agli obblighi previsti dal Regolamento (UE) 2023/1114 (MiCA), che richiedono l&apos;identificazione dell&apos;utente e la tracciabilità delle operazioni rilevanti;</ListItem>
          <ListItem>• c. Legittimo interesse del Titolare – ex art. 6(1)(f) GDPR: relativo alla prevenzione di frodi, alla sicurezza informatica, al monitoraggio tecnico della piattaforma e alla protezione dei diritti legali del Titolare, anche in sede giudiziale o amministrativa. Tali interessi sono bilanciati rispetto ai diritti e alle libertà fondamentali dell&apos;interessato;</ListItem>
          <ListItem>• d. Consenso esplicito dell&apos;interessato – ex art. 6(1)(a) GDPR: richiesto, ove necessario, ad esempio per il trattamento di categorie particolari di dati (come dati biometrici gestiti dal provider KYC) o per l&apos;invio di comunicazioni opzionali. In ogni caso, il consenso è sempre revocabile in qualsiasi momento.</ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          6. Conservazione dei dati
        </Typography>
        <Typography variant="body1" gutterBottom>
          I dati personali saranno conservati per un periodo non superiore a quanto necessario al conseguimento delle finalità indicate nella presente informativa e, in particolare:
        </Typography>
        <List dense>
          <ListItem>• a. Per i dati raccolti ai fini della verifica dell&apos;identità (KYC), la conservazione sarà garantita per almeno 5 anni dalla cessazione della relazione contrattuale, in conformità alle normative applicabili in materia di antiriciclaggio (AML/CFT). Il trattamento e la conservazione di tali dati, laddove delegati a fornitori esterni specializzati (es. Persona Identities, Inc.), avverranno nel rispetto degli accordi contrattuali e delle misure di sicurezza previste.</ListItem>
          <ListItem>• b. Per gli altri dati raccolti tramite la landing page (es. dati tecnici, e-mail, indirizzo IP), il periodo di conservazione non supererà i 12 mesi dalla raccolta, salvo obblighi di legge, finalità di difesa in giudizio o richieste delle autorità competenti.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Al termine dei periodi sopra indicati, i dati saranno cancellati, anonimizzati o resi inaccessibili, salvo che la loro ulteriore conservazione sia necessaria per adempiere a specifici obblighi normativi o in caso di contenziosi in corso.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          7. Destinatari e trasferimento dei dati
        </Typography>
        <Typography variant="body1" gutterBottom>
          I dati personali potranno essere comunicati, nel rispetto dei principi di liceità, necessità e proporzionalità, esclusivamente ai seguenti soggetti terzi:
        </Typography>
        <List dense>
          <ListItem>• a. Fornitori di servizi tecnologici e infrastrutturali (es. cloud, hosting, sicurezza informatica, manutenzione della piattaforma), limitatamente alle finalità tecniche e operative connesse all&apos;erogazione del servizio;</ListItem>
          <ListItem>• b. Autorità pubbliche, enti regolatori o giudiziari, in adempimento ad obblighi legali o su richiesta legittima delle stesse (es. autorità fiscali, antiriciclaggio, giudiziarie);</ListItem>
          <ListItem>• c. Consulenti professionali (legali, fiscali, contabili), limitatamente all&apos;assolvimento di obblighi normativi o per la tutela dei diritti del Titolare;</ListItem>
          <ListItem>• d. Persona Identities, Inc., in qualità di fornitore esterno specializzato nei servizi di verifica dell&apos;identità (KYC), come dettagliato al punto 10 della presente Privacy Policy.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Tutti i destinatari sono vincolati da accordi contrattuali che garantiscono adeguate misure di sicurezza e il rispetto della normativa vigente in materia di protezione dei dati personali (GDPR). In caso di trasferimenti verso Paesi terzi, saranno applicate garanzie appropriate ai sensi degli articoli 44 e seguenti del GDPR (es. decisioni di adeguatezza, Standard Contractual Clauses).
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          8. Trasferimenti Extra-UE
        </Typography>
        <Typography variant="body1" gutterBottom>
          Alcuni dati personali potrebbero essere trasferiti verso Paesi situati al di fuori dello Spazio Economico Europeo (SEE), tra cui gli Stati Uniti, in particolare nel caso di servizi forniti da soggetti terzi quali Persona Identities, Inc., provider con sede negli USA (vedi paragrafo 10).
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tali trasferimenti avverranno esclusivamente nel rispetto degli articoli 44 e seguenti del GDPR, adottando una o più delle seguenti garanzie appropriate:
        </Typography>
        <List dense>
          <ListItem>• a. Clausole Contrattuali Standard (Standard Contractual Clauses – SCC) adottate dalla Commissione Europea ai sensi dell&apos;art. 46(2)(c) GDPR;</ListItem>
          <ListItem>• b. Verifica del livello adeguato di protezione dei dati offerto dal destinatario, anche tramite audit e dichiarazioni di conformità alle misure supplementari previste dalle Linee Guida EDPB 01/2020;</ListItem>
          <ListItem>• c. Adozione di misure tecniche e organizzative idonee a garantire la sicurezza, l&apos;integrità e la non accessibilità non autorizzata dei dati personali trasferiti.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          L&apos;Utente può richiedere maggiori informazioni sulle garanzie applicabili o copia delle Clausole Contrattuali Standard scrivendo a: official@uranoecosystem.com o dpo@uranoecosystem.com
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          9. Diritti dell&apos;interessato
        </Typography>
        <Typography variant="body1" gutterBottom>
          L&apos;Utente, in qualità di interessato, può esercitare in qualsiasi momento i diritti riconosciuti dagli articoli 15-21 del GDPR, tra cui:
        </Typography>
        <List dense>
          <ListItem>• a. Diritto di accesso: ottenere conferma dell&apos;esistenza o meno di dati personali che lo riguardano e accedere agli stessi;</ListItem>
          <ListItem>• b. Diritto di rettifica: richiedere la correzione o l&apos;aggiornamento dei dati inesatti o incompleti;</ListItem>
          <ListItem>• c. Diritto alla cancellazione (&quot;oblio&quot;): ottenere la cancellazione dei propri dati nei casi previsti dall&apos;art. 17 GDPR;</ListItem>
          <ListItem>• d. Diritto alla limitazione del trattamento: richiedere la limitazione del trattamento nei casi previsti dall&apos;art. 18 GDPR;</ListItem>
          <ListItem>• e. Diritto di opposizione: opporsi al trattamento dei dati per motivi connessi alla propria situazione particolare (art. 21 GDPR);</ListItem>
          <ListItem>• f. Diritto alla portabilità dei dati: receive i propri dati in un formato strutturato, di uso comune e leggibile da dispositivo automatico e, se tecnicamente fattibile, trasmetterli a un altro titolare del trattamento.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          L&apos;Utente può esercitare i propri diritti inviando una richiesta:
        </Typography>
        <List dense>
          <ListItem>• via email al Titolare: official@uranoecosystem.com</ListItem>
          <ListItem>• oppure al Data Protection Officer (DPO): dpo@uranoecosystem.com</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Le richieste saranno evase entro 30 giorni dal ricevimento, salvo proroghe nei casi di particolare complessità, in conformità con l&apos;art. 12 GDPR.
        </Typography>
        <Typography variant="body1" gutterBottom>
          L&apos;esercizio dei diritti è gratuito, salvo nei casi in cui le richieste risultino manifestamente infondate o eccessive ai sensi dell&apos;art. 12(5) GDPR.
        </Typography>
        <Typography variant="body1" gutterBottom>
          L&apos;Utente ha inoltre il diritto di proporre reclamo a un&apos;autorità di controllo competente, qualora ritenga che il trattamento dei propri dati violi la normativa vigente in materia di protezione dei dati personali (art. 77 GDPR).
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          10. Sicurezza e protezione dei dati
        </Typography>
        <Typography variant="body1" gutterBottom>
          Il Titolare adotta misure tecniche e organizzative adeguate, in conformità agli articoli 24, 25 e 32 del GDPR, al fine di garantire un livello di sicurezza adeguato al rischio, tenuto conto della natura, dell&apos;ambito di applicazione, del contesto e delle finalità del trattamento.
        </Typography>
        <Typography variant="body1" gutterBottom>
          In particolare, vengono implementate misure volte a:
        </Typography>
        <List dense>
          <ListItem>• a. Garantire l&apos;integrità, la riservatezza e la disponibilità dei dati personali trattati;</ListItem>
          <ListItem>• b. Prevenire accessi non autorizzati, divulgazioni accidentali, distruzione, perdita, alterazione o trattamento illecito;</ListItem>
          <ListItem>• c. Applicare tecniche di crittografia e pseudonimizzazione per la protezione dei dati più sensibili;</ListItem>
          <ListItem>• d. Eseguire backup periodici e sistemi di disaster recovery per la resilienza operativa;</ListItem>
          <ListItem>• e. Monitorare e aggiornare regolarmente le infrastrutture digitali, incluse le piattaforme blockchain e smart contract utilizzati.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Inoltre, gli smart contract utilizzati per la Presale del token $URANO sono stati sottoposti ad audit di sicurezza da parte di terze parti indipendenti, al fine di garantire la trasparenza e la protezione dell&apos;interazione tecnica tra l&apos;utente e il protocollo. Maggiori informazioni sono disponibili alla pagina ufficiale: 
          <Link href="https://www.uranoecosystem.com/audit" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystem.com/audit
          </Link>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Nel caso in cui vengano coinvolti fornitori terzi (es. per il KYC o il cloud hosting), Urano Ecosystem assicura che tali soggetti siano vincolati da obblighi contrattuali di sicurezza e conformità al GDPR.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          11. Servizi verifica identità
        </Typography>
        <Typography variant="body1" gutterBottom>
          Per garantire la conformità alle normative antiriciclaggio (AML/CFT) e al Regolamento (UE) 2023/1114 (MiCA), Urano Ecosystem si avvale dei servizi di verifica dell&apos;identità forniti da Persona Identities, Inc., società con sede negli Stati Uniti, specializzata nell&apos;onboarding sicuro degli utenti e nella protezione dei dati personali, in qualità di Responsabile del trattamento ai sensi dell&apos;art. 28 del Regolamento (UE) 2016/679 (GDPR).
        </Typography>
        <Typography variant="body1" gutterBottom>
          Durante la procedura KYC (Know Your Customer), l&apos;Utente viene reindirizzato a una sessione sicura ospitata direttamente sulla piattaforma di Persona. In tale sede, Persona raccoglierà e tratterà i seguenti dati:
        </Typography>
        <List dense>
          <ListItem>• a. Dati identificativi (nome, cognome, data di nascita, indirizzo);</ListItem>
          <ListItem>• b. Documento di identità (passaporto, carta d&apos;identità, patente, ecc.);</ListItem>
          <ListItem>• c. Riconoscimento facciale tramite selfie o video breve (liveness check);</ListItem>
          <ListItem>• d. Dati biometrici, ove richiesti e previo consenso esplicito dell&apos;Utente;</ListItem>
          <ListItem>• e. Eventuali metadati tecnici necessari per la verifica.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Tali dati vengono trattati esclusivamente per le seguenti finalità:
        </Typography>
        <List dense>
          <ListItem>• a. Verifica dell&apos;identità dell&apos;utente;</ListItem>
          <ListItem>• b. Prevenzione delle frodi e delle attività illecite;</ListItem>
          <ListItem>• c. Adempimento degli obblighi normativi in materia di AML/CFT e MiCA;</ListItem>
          <ListItem>• d. Audit di sicurezza e conservazione a fini legali, ove previsto.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Persona adotta misure tecniche e organizzative avanzate per la protezione dei dati, tra cui crittografia, pseudonimizzazione, isolamento delle istanze, monitoraggio continuo e controlli di accesso granulari. I dati sono archiviati su infrastrutture conformi a standard internazionali, tra cui SOC 2 Tipo II e ISO 27001.
        </Typography>
        <Typography variant="body1" gutterBottom>
          L&apos;Utente conserva in ogni momento la possibilità di esercitare i diritti previsti dal GDPR, inclusi accesso, rettifica e cancellazione dei dati, direttamente attraverso la piattaforma Persona.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Urano Ecosystem non accede, conserva né tratta direttamente i dati biometrici o i documenti identificativi caricati dall&apos;Utente. Riceve unicamente:
        </Typography>
        <List dense>
          <ListItem>• L&apos;esito della verifica (verificato/non verificato),</ListItem>
          <ListItem>• Un identificativo univoco associato all&apos;Utente,</ListItem>
          <ListItem>• Una marca temporale della verifica.</ListItem>
        </List>
        <Typography variant="body1" gutterBottom>
          Persona Identities, Inc. garantisce piena conformità al GDPR e aderisce a framework internazionali per la protezione dei dati. Ulteriori dettagli sono disponibili alla loro informativa ufficiale:
        </Typography>
        <List dense>
          <ListItem>
            <Link href="https://withpersona.com/legal/privacy-policy?lang=it" target="_blank" rel="noopener">
              https://withpersona.com/legal/privacy-policy?lang=it
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://withpersona.com/legal" target="_blank" rel="noopener">
              https://withpersona.com/legal
            </Link>
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          12. Nessun processo decisionale automatizzato
        </Typography>
        <Typography variant="body1" gutterBottom>
          Urano Ecosystem non adotta processi decisionali automatizzati, inclusa la profilazione, che producano effetti giuridici o significativi sull&apos;interessato, ai sensi dell&apos;articolo 22 del Regolamento (UE) 2016/679 (GDPR).
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          13. Cookie e strumenti di tracciamento
        </Typography>
        <Typography variant="body1" gutterBottom>
          La presente landing page utilizza cookie tecnici di sessione necessari per il corretto funzionamento del sito e per garantire all&apos;utente un accesso sicuro ai servizi, compresa l&apos;eventuale integrazione con il sistema di verifica dell&apos;identità (KYC). Tali cookie rientrano nella categoria dei cookie essenziali e non richiedono il consenso dell&apos;utente, ai sensi della normativa vigente (art. 122 del Codice Privacy e art. 5.3 della Direttiva ePrivacy).
        </Typography>
        <Typography variant="body1" gutterBottom>
          Eventuali cookie di terze parti potrebbero essere impiegati per fini tecnici strettamente necessari (es. prevenzione frodi durante il KYC), in conformità con le misure tecniche applicate dal provider Persona Identities, Inc. Questi cookie sono attivi solo nella misura in cui siano indispensabili all&apos;erogazione sicura del servizio.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Per quanto riguarda invece cookie analitici, di profilazione o di tracciamento non essenziali, questi non vengono utilizzati su questa landing page. Qualora in futuro venissero implementati, saranno attivati esclusivamente previo consenso dell&apos;utente tramite apposito banner.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Per ulteriori dettagli sui cookie utilizzati nella presente landing page, è disponibile un documento specifico consultabile alla pagina:
          <Link href="https://www.uranoecosystempresale.com/cookie" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystempresale.com/cookie
          </Link>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Per informazioni complete sui cookie impiegati nell&apos;ambito dell&apos;intero ecosistema Urano, si rimanda alla Cookie Policy ufficiale, disponibile all&apos;indirizzo:
          <Link href="https://www.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystem.com/cookie-policy
          </Link>
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          14. Modifiche alla Privacy Policy
        </Typography>
        <Typography variant="body1" gutterBottom>
          Urano Ecosystem si riserva il diritto di modificare la presente Privacy Policy in qualsiasi momento, anche in conseguenza di aggiornamenti normativi, evoluzioni tecnologiche o cambiamenti organizzativi interni.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Eventuali modifiche saranno comunicate tramite annunci ufficiali pubblicati sui canali istituzionali del progetto, quali il sito web, i canali social ufficiali e altre comunicazioni pubbliche. L&apos;Utente è invitato a consultare periodicamente la versione più aggiornata dell&apos;informativa.
        </Typography>
        <Typography variant="body1" gutterBottom>
          La versione corrente della Privacy Policy è sempre disponibile al seguente indirizzo:
          <Link href="https://www.uranoecosystempresale.com/privacy" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystempresale.com/privacy
          </Link>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Per ulteriori informazioni sul trattamento dei dati personali nell&apos;ambito del sito principale e delle attività dell&apos;ecosistema Urano, è possibile consultare la Privacy Policy generale disponibile al seguente link: 
          <Link href="https://www.uranoecosystem.com/privacy-policy" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystem.com/privacy-policy
          </Link>
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          15. Validità normativa
        </Typography>
        <Typography variant="body1" gutterBottom>
          La presente Privacy Policy è redatta in conformità al Regolamento (UE) 2016/679 (GDPR) e, ove applicabile, al Regolamento (UE) 2023/1114 (MiCA). Essa costituisce parte integrante delle informazioni precontrattuali fornite all&apos;Utente, ai sensi della normativa vigente in materia di protezione dei dati personali e disciplina dei servizi relativi a crypto-asset.
        </Typography>
      </Stack>
      <Footer />
    </Stack>
  );
}