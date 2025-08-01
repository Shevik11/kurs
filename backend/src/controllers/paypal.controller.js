import paypal from 'paypal-rest-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'ATSccmKUYlTrgYBftuEbwsCaJgzNlXU7s1rrmU5WTbTyE_wGIv3MpecF_qdT5CPEcHyr0yFrtneH1iEq',
  'client_secret': 'EA-9AJj0Pzq67kPeTWy-NM0FCpFzdWkDTfIDcvtEku0qupujR-cEKuco1LQR9Ue6ui9fRRnTuRIUoSMW'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PaypalController = {
  createPayment(req, res) {
    const create_payment_json = {
      "intent": "sale",
      "payer": { "payment_method": "paypal" },
      "redirect_urls": {
        "return_url": "http://localhost:8000/api/paypal/success",
        "cancel_url": "http://localhost:8000/api/paypal/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "Premium",
            "sku": "001",
            "price": "5.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": { "currency": "USD", "total": "5.00" },
        "description": "Premium function"
      }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.status(500).json({ error });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.json({ approval_url: payment.links[i].href });
          }
        }
        res.status(500).json({ error: 'No approval_url found' });
      }
    });
  },
  success(req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{ "amount": { "currency": "USD", "total": "5.00" } }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json({ success: true, payment });
      }
    });
  },
  cancel(req, res) {
    res.json({ cancelled: true });
  },
  html(req, res) {
    res.sendFile(path.join(__dirname, '../../static/paypal.html'));
  }
};

export default PaypalController; 