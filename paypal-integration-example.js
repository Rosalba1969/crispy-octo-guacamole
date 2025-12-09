/**
 * Esempio di Integrazione PayPal
 * 
 * Questo file mostra come integrare PayPal nel tuo progetto.
 * Puoi usare questo codice come punto di partenza per la tua implementazione.
 */

// Esempio usando il PayPal REST SDK per Node.js
// Installazione: npm install @paypal/checkout-server-sdk

const paypal = require('@paypal/checkout-server-sdk');

// 1. Configurazione dell'ambiente PayPal
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || 'YOUR_CLIENT_ID';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
  
  // Usa SandboxEnvironment per testing, LiveEnvironment per production
  if (process.env.PAYPAL_MODE === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// 2. Creare un client PayPal
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// 3. Creare un ordine di pagamento
async function createOrder(amount, currency = 'EUR') {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount
      },
      description: 'Descrizione del prodotto/servizio'
    }],
    application_context: {
      return_url: 'https://your-domain.com/payment/success',
      cancel_url: 'https://your-domain.com/payment/cancel',
      brand_name: 'Il Tuo Brand',
      locale: 'it-IT',
      user_action: 'PAY_NOW'
    }
  });

  try {
    const order = await client().execute(request);
    console.log('Ordine creato:', order.result.id);
    return order.result;
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error);
    throw error;
  }
}

// 4. Catturare un pagamento
async function captureOrder(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    console.log('Pagamento catturato:', capture.result.id);
    return capture.result;
  } catch (error) {
    console.error('Errore nella cattura del pagamento:', error);
    throw error;
  }
}

// 5. Effettuare un rimborso
async function refundPayment(captureId, amount, currency = 'EUR') {
  const request = new paypal.payments.CapturesRefundRequest(captureId);
  
  // Rimborso parziale se amount è specificato, altrimenti rimborso completo
  if (amount) {
    request.requestBody({
      amount: {
        currency_code: currency,
        value: amount
      }
    });
  }

  try {
    const refund = await client().execute(request);
    console.log('Rimborso effettuato:', refund.result.id);
    return refund.result;
  } catch (error) {
    console.error('Errore nel rimborso:', error);
    throw error;
  }
}

// 6. Esempio di integrazione in un server Express
// Installazione: npm install express body-parser

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Endpoint per creare un ordine
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await createOrder(amount);
    res.json({
      orderId: order.id,
      approvalUrl: order.links.find(link => link.rel === 'approve').href
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint per catturare un pagamento
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    const capture = await captureOrder(orderId);
    res.json({ 
      success: true, 
      captureId: capture.id,
      status: capture.status 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint per webhook PayPal
app.post('/webhooks/paypal', async (req, res) => {
  const event = req.body;
  
  // Verifica la firma del webhook per la sicurezza
  // IMPORTANTE: Implementa sempre la verifica della firma in production
  // Per informazioni sulla verifica: https://developer.paypal.com/api/rest/webhooks/
  
  /*
  // Esempio di verifica della firma del webhook:
  const webhookId = 'YOUR_WEBHOOK_ID'; // Ottieni dal Dashboard PayPal
  const paypal = require('@paypal/checkout-server-sdk');
  
  const headers = req.headers;
  const webhookEvent = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: req.body
  };
  
  // Verifica la firma
  const isValid = await verifyWebhookSignature(webhookEvent);
  if (!isValid) {
    return res.sendStatus(401);
  }
  */
  
  switch(event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      console.log('Pagamento completato:', event.resource);
      // Aggiorna il database, invia email di conferma, etc.
      break;
    case 'PAYMENT.CAPTURE.REFUNDED':
      console.log('Pagamento rimborsato:', event.resource);
      // Gestisci il rimborso
      break;
    default:
      console.log('Evento non gestito:', event.event_type);
  }
  
  res.sendStatus(200);
});

// 7. Esempio di integrazione frontend (HTML/JavaScript)
/*
<!DOCTYPE html>
<html>
<head>
  <title>PayPal Payment Example</title>
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=EUR&locale=it_IT"></script>
</head>
<body>
  <div id="paypal-button-container"></div>

  <script>
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '10.00',
              currency_code: 'EUR'
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Pagamento completato da ' + details.payer.name.given_name);
          console.log('Transaction details:', details);
        });
      },
      onError: function(err) {
        console.error('Errore PayPal:', err);
        alert('Si è verificato un errore durante il pagamento');
      }
    }).render('#paypal-button-container');
  </script>
</body>
</html>
*/

// Esporta le funzioni per l'uso in altri moduli
module.exports = {
  createOrder,
  captureOrder,
  refundPayment,
  client
};

// Avvia il server (se eseguito direttamente)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
    console.log(`Modalità: ${process.env.PAYPAL_MODE || 'sandbox'}`);
  });
}
