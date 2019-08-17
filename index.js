const express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mailer = require('./mailer'),
  { WebhookClient } = require('dialogflow-fulfillment')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());

/** Handle bot fufillments using this endpoint*/
app.post('/bot', (request, response) => {
  const agent = new WebhookClient({ request, response })

  // Parse Dialogflow JSON payload
  const { parameters } = request.body.queryResult

  // Intent function
  function contactUser(agent) {

    // Mail message
    const message = {
      from: `DSC UI <${process.env.GMAIL_USERNAME}>`,
      to: parameters.email,
      subject: 'Welcome to DSC UI',
      html: `<p>Hi,</p>
      <p>Thank you for contactng DSC UI. We look forward to doing great things together.</p>
      <p>You can reach us through any of these media:</p>
      <pre>Email: dsc.unibadan@gmail.com</pre>
      <pre>Twitter: @dsc_ui</pre>
      <pre>Phone Number: 
      Olu-flourish +234 8161691655 
      Michael +234 8102723247</pre>
      <pre>Telegram: @dscui_bot</pre>
      <p>Regards</p>
      <p>DSC UI Team</p>`
    };

    // Send the mail
    mailer.sendMail(message, () => { })

    // Return response(s) to the agent
    agent.add('A mail will be sent to you shortly')
    agent.add(`You can reach us through any these media:

        Email: dsc.unibadan@gmail.com

        Twitter: @dsc_ui

        Phone Number: 
         Olu-flourish +234 8161691655 
         Michael +234 8102723247

        Telegram: @dscui_bot`)
  }

  // Run the proper handler based on the matched Dialogflow intent
  let intentMap = new Map()
  intentMap.set('Contact DSC - Send Mail', contactUser) // Send Email
  agent.handleRequest(intentMap)
});

module.exports = app;