# crispy-octo-guacamole

## Configurazione Pagamenti PayPal

Questa guida ti aiuterà a configurare i pagamenti PayPal per la tua applicazione.

### Prerequisiti

1. Un account PayPal Business o Developer
2. Accesso al [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
3. Credenziali API (Client ID e Secret)

### Passaggi per la Configurazione

#### 1. Creare un'App PayPal

1. Accedi al [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Vai su **Apps & Credentials**
3. Clicca su **Create App**
4. Scegli un nome per la tua applicazione
5. Seleziona il tipo di integrazione desiderato
6. Copia il **Client ID** e il **Secret**

#### 2. Configurare le Credenziali

Crea un file `.env` nella root del tuo progetto (vedi `.env.example` per un esempio):

```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

**IMPORTANTE:** Non committare mai il file `.env` nel repository. Aggiungi `.env` al tuo `.gitignore`.

#### 3. Modalità Sandbox vs Production

- **Sandbox**: Per testing e sviluppo
  - URL: `https://api-m.sandbox.paypal.com`
  - Usa account di test creati nel Developer Dashboard
  
- **Production**: Per ambiente live
  - URL: `https://api-m.paypal.com`
  - Usa credenziali dell'app production

#### 4. Esempio di Integrazione

Consulta il file `paypal-integration-example.js` per un esempio completo di come integrare PayPal nella tua applicazione.

### Funzionalità Supportate

- ✅ Pagamenti one-time
- ✅ Pagamenti ricorrenti (subscriptions)
- ✅ Rimborsi
- ✅ Webhook per notifiche

### Risorse Utili

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal REST API Reference](https://developer.paypal.com/api/rest/)
- [PayPal JavaScript SDK](https://developer.paypal.com/sdk/js/)
- [PayPal Sandbox Testing Guide](https://developer.paypal.com/tools/sandbox/)

### Supporto

Per problemi o domande:
- [PayPal Developer Community](https://www.paypal-community.com/t5/Developer-and-Integration/ct-p/developer-forum)
- [PayPal Technical Support](https://developer.paypal.com/support/)

### Sicurezza

⚠️ **Best Practices**:
- Non esporre mai le tue credenziali API
- Usa variabili d'ambiente per le credenziali
- Implementa la validazione dei webhook
- Usa HTTPS in production
- Valida tutti i pagamenti lato server