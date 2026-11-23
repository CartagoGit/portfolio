# Contact delivery contract

The public portfolio is served as static Angular output, so browser code must never contain a secret credential. The contact form uses the public FormSubmit AJAX endpoint configured through `CONTACT_DELIVERY_CONFIG` in `src/app/app.config.ts`.

## Configured route

- Delivery endpoint: `https://formsubmit.co/ajax/cv2mario@gmail.com`
- Fallback recipient: `cv2mario@gmail.com`
- Transport: `POST`, JSON response, 10-second client timeout
- Payload: visitor email, message, stable subject, table template and an empty honeypot

The first production delivery to a FormSubmit recipient must be activated through the provider's confirmation email. Until the recipient confirms the endpoint, a network/provider error is shown as a failure and the form does not claim that anything was sent.

## UI contract

1. Email is required and must be syntactically valid.
2. Message is required and must contain 20–2000 characters.
3. During submission, controls show a sending state and duplicate submits are blocked.
4. Only an explicit `{ "success": true }` (or string `"true"`) response produces the success state.
5. Provider rejection, timeout, network failure or missing endpoint produces an error state and a prefilled `mailto:` fallback.
6. The fallback copy explicitly says that nothing was sent; it never infers success from opening the visitor's email app.

## Replacing the provider

Keep the provider change inside `DEFAULT_CONTACT_DELIVERY_CONFIG`. Replace the endpoint/fallback pair, then update `ContactDeliveryService.submit` only if the new provider has a different payload or receipt schema. Do not put a secret API key in `app.config.ts`, translation files or a public environment file. Providers that require a secret belong behind a serverless function or other server-side proxy, not in this GitHub Pages bundle.

The service and form tests use `HttpTestingController` and injected fakes. They validate the payload, explicit receipt, validation path, success state and failure fallback without sending a real message.
