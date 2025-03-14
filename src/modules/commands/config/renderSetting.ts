import { BeccaInt } from "../../../interfaces/BeccaInt";
import { LevelRoleInt } from "../../../interfaces/settings/LevelRoleInt";
import { SettingsTypes } from "../../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

export const renderSetting = (
  Becca: BeccaInt,
  key: SettingsTypes,
  value: string | LevelRoleInt
): string => {
  try {
    if (!value) {
      return "No value set.";
    }
    switch (key) {
      case "prefix":
      case "thanks":
      case "levels":
      case "custom_welcome":
      case "allowed_links":
      case "link_message":
        return value as string;
      case "welcome_channel":
      case "log_channel":
      case "level_channel":
      case "suggestion_channel":
        return `<#${value}>`;
      case "hearts":
      case "blocked":
        return `<@!${value}>`;
      case "self_roles":
      case "link_roles":
        return `<@&${value}>`;
      case "anti_links":
      case "permit_links":
        return value === "all" ? value : `<#${value}>`;
      case "level_roles":
        return `<@&${(value as LevelRoleInt).role}> at level ${
          (value as LevelRoleInt).level
        }`;
      default:
        return "Something went wrong with rendering this setting.";
    }
  } catch (err) {
    beccaErrorHandler(Becca, "render setting module", err);
    return "Something went wrong with rendering this setting.";
  }
};
