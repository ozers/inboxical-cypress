import { Inboxical } from "@inboxical/sdk";
import type { Inbox, Message } from "@inboxical/sdk";

export type { Inbox, Message };

export interface InboxicalCypressConfig {
  /** Inboxical API key. Defaults to INBOXICAL_API_KEY env var. */
  apiKey?: string;
  /** Base URL override. */
  baseUrl?: string;
}

/**
 * Register Inboxical tasks in your Cypress config file.
 *
 * @example
 * ```ts
 * // cypress.config.ts
 * import { defineConfig } from "cypress";
 * import { setupInboxical } from "@inboxical/cypress";
 *
 * export default defineConfig({
 *   e2e: {
 *     setupNodeEvents(on, config) {
 *       setupInboxical(on, config, {
 *         apiKey: process.env.INBOXICAL_API_KEY,
 *       });
 *       return config;
 *     },
 *   },
 * });
 * ```
 */
export function setupInboxical(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  options?: InboxicalCypressConfig,
): void {
  const apiKey = options?.apiKey || config.env["INBOXICAL_API_KEY"] || process.env.INBOXICAL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Inboxical API key is required. Set INBOXICAL_API_KEY env var or pass apiKey in options.",
    );
  }

  const client = new Inboxical({
    apiKey,
    baseUrl: options?.baseUrl,
  });

  on("task", {
    async inboxicalCreateInbox(
      args: { name?: string; domain?: string } | null,
    ): Promise<{ id: string; email: string }> {
      const inbox = await client.createInbox(args ?? undefined);
      return { id: inbox.id, email: inbox.email_address };
    },

    async inboxicalGetInbox(inboxId: string): Promise<Inbox> {
      return client.getInbox(inboxId);
    },

    async inboxicalDeleteInbox(inboxId: string): Promise<null> {
      await client.deleteInbox(inboxId);
      return null;
    },

    async inboxicalGetMessages(inboxId: string): Promise<Message[]> {
      const result = await client.getMessages(inboxId);
      return result.messages;
    },

    async inboxicalGetLatestMessage(inboxId: string): Promise<Message> {
      return client.getLatestMessage(inboxId);
    },

    async inboxicalWaitForMessage(
      args: { inboxId: string; timeout?: number; since?: string },
    ): Promise<Message> {
      return client.waitForMessage(args.inboxId, {
        timeout: args.timeout,
        since: args.since,
      });
    },

    async inboxicalGetMessage(messageId: string): Promise<Message> {
      return client.getMessage(messageId);
    },

    async inboxicalDeleteMessage(messageId: string): Promise<null> {
      await client.deleteMessage(messageId);
      return null;
    },

    inboxicalExtractCode(
      args: { message: Message; pattern?: string },
    ): string | null {
      const patternRegex = args.pattern ? new RegExp(args.pattern) : undefined;
      return client.extractCode(args.message, { pattern: patternRegex });
    },
  });
}
