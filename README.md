# @inboxical/cypress

[Inboxical](https://inboxical.com) plugin for [Cypress](https://www.cypress.io/) — test email flows in your E2E tests.

## Install

```bash
npm install @inboxical/cypress @inboxical/sdk
```

## Setup

### 1. Register tasks in `cypress.config.ts`

```ts
import { defineConfig } from "cypress";
import { setupInboxical } from "@inboxical/cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupInboxical(on, config, {
        apiKey: process.env.INBOXICAL_API_KEY,
      });
      return config;
    },
  },
});
```

### 2. Import commands in `cypress/support/commands.ts`

```ts
import "@inboxical/cypress/commands";
```

## Usage

```ts
describe("Email verification", () => {
  it("should verify email with OTP", () => {
    cy.inboxicalCreateInbox().then(({ id, email }) => {
      cy.visit("/signup");
      cy.get("#email").type(email);
      cy.get("form").submit();

      cy.inboxicalWaitForMessage(id, { timeout: 30 }).then((message) => {
        expect(message.subject).to.include("Verify");

        cy.inboxicalExtractCode(message).then((code) => {
          cy.get("#otp-input").type(code);
          cy.get("#verify-btn").click();
          cy.contains("Welcome").should("be.visible");
        });
      });

      cy.inboxicalDeleteInbox(id);
    });
  });
});
```

## Commands

| Command | Description |
|---------|-------------|
| `cy.inboxicalCreateInbox(options?)` | Create a disposable test inbox |
| `cy.inboxicalWaitForMessage(inboxId, options?)` | Wait for a message (long-poll) |
| `cy.inboxicalGetMessages(inboxId)` | Get all messages in inbox |
| `cy.inboxicalGetLatestMessage(inboxId)` | Get the latest message |
| `cy.inboxicalDeleteInbox(inboxId)` | Delete inbox and messages |
| `cy.inboxicalExtractCode(message, pattern?)` | Extract OTP/verification code |

## Related

- [`@inboxical/sdk`](https://github.com/ozers/inboxical-sdk) — Core Node.js SDK
- [`@inboxical/playwright`](https://github.com/ozers/inboxical-playwright) — Playwright helper

## License

MIT
