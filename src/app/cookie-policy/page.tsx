import { Stack, Typography, Link, List, ListItem } from '@mui/material';
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
      <Stack flex={1} sx={{ p: { xs: 3, md: 9 } }} justifyContent="start" gap={{xs: 2, lg: 4}}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Cookie Policy – Urano Ecosystem Presale
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Ultimo aggiornamento: [25/07/2025]
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          La presente Cookie Policy descrive l&apos;utilizzo dei cookie e di tecnologie affini all&apos;interno della landing page della Presale di Urano Ecosystem, accessibile all&apos;indirizzo: https://www.uranoecosystempresale.com (di seguito, la &quot;Landing Page&quot;).
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          1. Titolare del trattamento
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Il Titolare del trattamento dei dati personali è:
        </Typography>
        
        <List dense>
          <ListItem>Urano Ecosystem sp. z o.o.</ListItem>
          <ListItem>ul. Mickiewicza 39A/3, 86-300 Grudziądz (Kujawsko-Pomorskie), Poland</ListItem>
          <ListItem>NIP: 8762504246</ListItem>
          <ListItem>Email: official@uranoecosystem.com</ListItem>
        </List>
        
        <Typography variant="body1" gutterBottom>
          Per richieste relative alla protezione dei dati personali e ai cookie, è possibile contattare anche il DPO all&apos;indirizzo: dpo@uranoecosystem.com
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          2. Cosa sono i cookie
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          I cookie sono piccoli file di testo che un sito web invia al dispositivo dell&apos;utente, dove vengono memorizzati per poi essere ritrasmessi al sito alla visita successiva. I cookie possono essere:
        </Typography>
        
        <List dense>
          <ListItem>• Tecnici/essenziali: necessari per il corretto funzionamento del sito;</ListItem>
          <ListItem>• Analitici/funzionali: usati per finalità statistiche anonime;</ListItem>
          <ListItem>• Profilanti/pubblicitari: usati per tracciare il comportamento dell&apos;utente per finalità di marketing.</ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          3. Tipologie di cookie utilizzati
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          La presente Landing Page utilizza solo:
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          a. Cookie tecnici (essenziali)
        </Typography>
        
        <List dense>
          <ListItem>• Necessari per la navigazione e l&apos;erogazione delle funzionalità minime della Landing Page.</ListItem>
          <ListItem>• Non richiedono consenso.</ListItem>
          <ListItem>• Installati automaticamente al primo accesso.</ListItem>
          <ListItem>• Gestiti tramite Cookiebot, che consente di informare l&apos;utente in modo trasparente.</ListItem>
        </List>
        
        <Typography variant="body1" gutterBottom>
          b. Cookie di terze parti (anonimi e funzionali)
        </Typography>
        
        <List dense>
          <ListItem>• Utilizzati esclusivamente per finalità tecniche o di sicurezza (es. mitigazione DDoS, firewall, caching).</ListItem>
          <ListItem>• Forniti da soggetti esterni (es. Cloudflare).</ListItem>
          <ListItem>• Non usati per profilazione, marketing o pubblicità.</ListItem>
          <ListItem>• I dati raccolti non permettono l&apos;identificazione dell&apos;utente.</ListItem>
        </List>
        
        <Typography variant="body1" gutterBottom>
          Non sono utilizzati:
        </Typography>
        
        <List dense>
          <ListItem>• Cookie di profilazione;</ListItem>
          <ListItem>• Cookie pubblicitari o comportamentali;</ListItem>
          <ListItem>• Tecnologie invasive o di marketing.</ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          4. Base giuridica del trattamento
        </Typography>
        
        <List dense>
          <ListItem>• Art. 6(1)(b) GDPR – per i cookie tecnici: trattamento necessario all&apos;erogazione del servizio richiesto.</ListItem>
          <ListItem>• Art. 6(1)(f) GDPR – per cookie tecnici di terze parti: legittimo interesse del Titolare a garantire sicurezza, stabilità e funzionalità della Landing Page.</ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          5. Gestione dei cookie
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Poiché la Landing Page utilizza solo cookie essenziali e nessun cookie soggetto a consenso, non è presente un banner attivo di accettazione. Tuttavia, l&apos;utente visualizza un&apos;informativa tramite Cookiebot, con la classificazione dei cookie utilizzati e la precisazione che:
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          L&apos;utente può comunque gestire o eliminare i cookie tramite le impostazioni del browser:
        </Typography>
        
        <List dense>
          <ListItem>
            <Link href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">
              Chrome
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://support.mozilla.org/it/kb/attivare-e-disattivare-i-cookie" target="_blank" rel="noopener">
              Firefox
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener">
              Safari
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener">
              Edge
            </Link>
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          6. Trasferimenti extra-UE
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          L&apos;uso di strumenti tecnici di terze parti (es. Cloudflare, CDN, hosting) può comportare il trasferimento di dati tecnici (es. indirizzi IP) verso Paesi terzi (come gli Stati Uniti).
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Tali trasferimenti avvengono nel rispetto degli articoli 44 e seguenti del GDPR, mediante:
        </Typography>
        
        <List dense>
          <ListItem>• Clausole Contrattuali Standard (SCC);</ListItem>
          <ListItem>• Verifica di garanzie adeguate da parte dei fornitori coinvolti.</ListItem>
        </List>

        <Typography variant="h6" component="h2" gutterBottom>
          7. Modifiche alla Cookie Policy
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          La presente Cookie Policy potrà essere aggiornata in qualsiasi momento, anche a seguito di evoluzioni normative, cambiamenti tecnici o aggiornamenti delle funzionalità della Landing Page.
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          L&apos;ultima versione sarà sempre consultabile all&apos;indirizzo: https://www.uranoecosystempresale.com/cookie
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Per informazioni più ampie sull&apos;uso dei cookie nel sito principale, è disponibile la Cookie Policy generale di Urano Ecosystem: 
          <Link href="https://www.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            https://www.uranoecosystem.com/cookie-policy
          </Link>
        </Typography>
      </Stack>
      <Footer />
    </Stack>
  );
}