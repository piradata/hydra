import { registerEvent } from "../register-event";

import type { UserPreferences } from "@types";
import i18next from "i18next";
import { db, levelKeys } from "@main/level";

const updateUserPreferences = async (
  _event: Electron.IpcMainInvokeEvent,
  preferences: Partial<UserPreferences>
) => {
  const userPreferences = await db.get<string, UserPreferences>(
    levelKeys.userPreferences,
    { valueEncoding: "json" }
  );

  if (preferences.language) {
    await db.put<string, string>(levelKeys.language, preferences.language, {
      valueEncoding: "utf-8",
    });

    i18next.changeLanguage(preferences.language);
  }

  await db.put<string, UserPreferences>(
    levelKeys.userPreferences,
    {
      ...userPreferences,
      ...preferences,
    },
    {
      valueEncoding: "json",
    }
  );
};

registerEvent("updateUserPreferences", updateUserPreferences);
