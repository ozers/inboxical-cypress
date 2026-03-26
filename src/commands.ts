import type { Message } from "@inboxical/sdk";

/**
 * Type declarations for Inboxical Cypress custom commands.
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Create a new Inboxical test inbox.
       * @returns Object with `id` and `email` properties.
       *
       * @example
       * ```ts
       * cy.inboxicalCreateInbox().then(({ id, email }) => {
       *   cy.get("#email-input").type(email);
       * });
       * ```
       */
      inboxicalCreateInbox(options?: {
        name?: string;
        domain?: string;
      }): Chainable<{ id: string; email: string }>;

      /**
       * Wait for a message to arrive in the inbox (long-poll).
       * @param inboxId - The inbox ID to watch.
       * @param options - Optional timeout (seconds) and since (ISO date).
       *
       * @example
       * ```ts
       * cy.inboxicalWaitForMessage(inboxId, { timeout: 30 }).then((msg) => {
       *   expect(msg.subject).to.include("Verify");
       * });
       * ```
       */
      inboxicalWaitForMessage(
        inboxId: string,
        options?: { timeout?: number; since?: string },
      ): Chainable<Message>;

      /**
       * Get all messages in an inbox.
       * @param inboxId - The inbox ID.
       */
      inboxicalGetMessages(inboxId: string): Chainable<Message[]>;

      /**
       * Get the latest message in an inbox.
       * @param inboxId - The inbox ID.
       */
      inboxicalGetLatestMessage(inboxId: string): Chainable<Message>;

      /**
       * Delete a Inboxical test inbox and all its messages.
       * @param inboxId - The inbox ID to delete.
       */
      inboxicalDeleteInbox(inboxId: string): Chainable<void>;

      /**
       * Extract an OTP/verification code from a message.
       * @param message - The message to extract from.
       * @param pattern - Optional regex pattern string (must contain a capture group).
       */
      inboxicalExtractCode(
        message: Message,
        pattern?: string,
      ): Chainable<string | null>;
    }
  }
}

/**
 * Register Inboxical custom commands.
 *
 * Import this file in your `cypress/support/commands.ts`:
 * ```ts
 * import "@inboxical/cypress/commands";
 * ```
 */
Cypress.Commands.add(
  "inboxicalCreateInbox",
  (options?: { name?: string; domain?: string }) => {
    return cy.task("inboxicalCreateInbox", options ?? null);
  },
);

Cypress.Commands.add(
  "inboxicalWaitForMessage",
  (inboxId: string, options?: { timeout?: number; since?: string }) => {
    return cy.task(
      "inboxicalWaitForMessage",
      { inboxId, ...options },
      { timeout: ((options?.timeout ?? 30) + 10) * 1000 },
    );
  },
);

Cypress.Commands.add("inboxicalGetMessages", (inboxId: string) => {
  return cy.task("inboxicalGetMessages", inboxId);
});

Cypress.Commands.add("inboxicalGetLatestMessage", (inboxId: string) => {
  return cy.task("inboxicalGetLatestMessage", inboxId);
});

Cypress.Commands.add("inboxicalDeleteInbox", (inboxId: string) => {
  return cy.task("inboxicalDeleteInbox", inboxId);
});

Cypress.Commands.add(
  "inboxicalExtractCode",
  (message: Message, pattern?: string) => {
    return cy.task("inboxicalExtractCode", { message, pattern });
  },
);
