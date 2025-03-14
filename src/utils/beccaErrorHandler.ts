import * as Sentry from "@sentry/node";
import { Message, MessageEmbed } from "discord.js";
import { Types } from "mongoose";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaLogHandler } from "./beccaLogHandler";
import { customSubstring } from "./customSubstring";

/**
 * Automated error handler to pass errors to Sentry and the logger.
 * @param Becca Becca's Client object
 * @param context The string explaining where this error was thrown.
 * @param error The standard error object (generated in a catch statement)
 * @param guild The name of the guild that triggered the issue.
 * @param message Optional message that triggered the issue.
 */
export const beccaErrorHandler = async (
  Becca: BeccaInt,
  context: string,
  error: Error,
  guild?: string,
  message?: Message
): Promise<Types.ObjectId> => {
  /**
   * Log the error to the terminal.
   */
  beccaLogHandler.log("error", `There was an error in the ${context}:`);
  beccaLogHandler.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );
  /**
   * Send the error to Sentry.
   */
  Sentry.captureException(error);
  /**
   * Send the error to Becca's webhook.
   */
  const errorId = Types.ObjectId();
  const errorEmbed = new MessageEmbed();
  errorEmbed.setTitle(
    `${context} error ${guild ? "in " + guild : "from an unknown source"}.`
  );
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setDescription(customSubstring(error.message, 2000));
  errorEmbed.addField(
    "Stack Trace:",
    `\`\`\`\n${customSubstring(error.stack || "null", 1000)}\n\`\`\``
  );
  errorEmbed.addField("Error ID", errorId);
  errorEmbed.setTimestamp();
  if (message) {
    errorEmbed.addField(
      "Message Content:",
      customSubstring(message.content, 1000)
    );
  }
  await Becca.debugHook.send(errorEmbed);

  return errorId;
};
