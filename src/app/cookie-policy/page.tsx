'use client';

import { Stack, Typography, Link, List, ListItem, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme, type Theme } from '@mui/material/styles';

export default function CookiePolicy() {
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
            Cookie Policy – Urano Ecosystem Presale
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Last updated: [25/07/2025]
          </Typography>
          
          <Typography variant="body1" paragraph>
            This Cookie Policy describes the use of cookies and similar technologies on the Presale di Urano Ecosystem landing page, accessible at:{' '}
            <Link href="https://www.presale.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
            https://www.presale.uranoecosystem.com/cookie-policy
            </Link>{' '}
            (hereinafter, the &ldquo;Landing Page&rdquo;).
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            1. Data controller
          </Typography>
          
          <Typography variant="body1" paragraph>
            The Data Controller is:
          </Typography>
          
          <List dense>
            <ListItem>Urano Ecosystem sp. z o.o.</ListItem>
            <ListItem>Mickiewicza 39A/3, 86-300 Grudziądz (Kuyavian-Pomeranian Voivodeship), Poland</ListItem>
            <ListItem>NIP: 8762504246</ListItem>
            <ListItem>Email: official@uranoecosystem.com</ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            For requests relating to the protection of personal data and cookies, you can also contact the DPO at:{' '}
            <Link href="mailto:dpo@uranoecosystem.com" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              dpo@uranoecosystem.com
            </Link>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            2. What are cookies?
          </Typography>
          
          <Typography variant="body1" paragraph>
            Cookies are small text files that a website sends to the user&apos;s device, where they are stored before being retransmitted to the site on the next visit. Cookies can be:
          </Typography>
          
          <List dense>
            <ListItem>Technical/Essential: necessary for the correct functioning of the site;</ListItem>
            <ListItem>Analytical/functional: used for anonymous statistical purposes;</ListItem>
            <ListItem>Profilers/Advertisers: used to track user behavior for marketing purposes.</ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            3. Types of cookies used
          </Typography>
          
          <Typography variant="body1" paragraph>
            This Landing Page use only:
          </Typography>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            a. Technical cookies (essential)
          </Typography>
          
          <Typography variant="body1" paragraph>
            Necessary for navigation and the provision of the minimum functionality of the Landing Page.
          </Typography>
          
          <List dense>
            <ListItem>They do not require consent.</ListItem>
            <ListItem>Installed automatically on first login.</ListItem>
            <ListItem>Managed by Cookiebot, which allows the user to be informed in a transparent manner.</ListItem>
          </List>
          
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
            b. Third-party cookies (anonymous and functional)
          </Typography>
          
          <Typography variant="body1" paragraph>
            Used exclusively for technical or security purposes (e.g. DDoS mitigation, firewall, caching).
          </Typography>
          
          <List dense>
            <ListItem>Provided by external parties (e.g. Cloudflare).</ListItem>
            <ListItem>Not used for profiling, marketing or advertising.</ListItem>
            <ListItem>The data collected does not allow the user to be identified.</ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', mt: 2 }}>
            They are not used:
          </Typography>
          
          <List dense>
            <ListItem>Profiling cookies;</ListItem>
            <ListItem>Advertising or behavioral cookies;</ListItem>
            <ListItem>Invasive or marketing technologies.</ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            4. Legal basis for processing
          </Typography>
          
          <List dense>
            <ListItem>
              <Typography variant="body1">
                <strong>Art. 6(1)(b) GDPR</strong> – for technical cookies: processing necessary to provide the requested service.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Art. 6(1)(f) GDPR</strong> – for third-party technical cookies: the Data Controller&apos;s legitimate interest in ensuring the security, stability, and functionality of the Landing Page.
              </Typography>
            </ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            5. Cookie management
          </Typography>
          
          <Typography variant="body1" paragraph>
            Since the Landing Page uses only essential cookies and no cookies subject to consent, there is no active acceptance banner. However, the user sees an information notice via Cookiebot, with the classification of the cookies used and the clarification that:
          </Typography>
          
          <Typography variant="body1" paragraph>
            The user can still manage or delete cookies through the browser settings:
          </Typography>
          
          <List dense>
            <ListItem>
              <Link href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                Chrome
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                Firefox
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                Safari
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
                Edge
              </Link>
            </ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            6. Transfers outside the EU
          </Typography>
          
          <Typography variant="body1" paragraph>
            The use of third-party technical tools (e.g., Cloudflare, CDN, hosting) may involve the transfer of technical data (e.g., IP addresses) to third-party countries (such as the United States).
          </Typography>
          
          <Typography variant="body1" paragraph>
            Such transfers take place in compliance with the articles 44 and following of the GDPR, through:
          </Typography>
          
          <List dense>
            <ListItem>Standard Contractual Clauses (SCC);</ListItem>
            <ListItem>Verification of adequate guarantees by the suppliers involved.</ListItem>
          </List>

          <Typography variant="h6" component="h2" gutterBottom>
            7. Changes to the Cookie Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            This Cookie Policy may be updated at any time, including as a result of regulatory changes, technical changes, or updates to the Landing Page&apos;s functionality.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The latest version will always be available at:{' '}
            <Link href="https://www.presale.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
            https://www.presale.uranoecosystem.com/cookie-policy
            </Link>
          </Typography>
          
          <Typography variant="body1" paragraph>
            For more detailed information on the use of cookies on the main site, please see the Urano Ecosystem general Cookie Policy:{' '}
            <Link href="https://www.uranoecosystem.com/cookie-policy" target="_blank" rel="noopener" sx={{ textDecoration: 'none', color: theme.palette.uranoGreen1.main }}>
              https://www.uranoecosystem.com/cookie-policy
            </Link>
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