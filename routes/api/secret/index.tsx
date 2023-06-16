import { Handlers } from "$fresh/server.ts";
import { addSecret, getUserBySession } from "@utils/db.ts";
import { SessionState, User } from "@utils/types.ts";
import { MAX_DECRYPT_ATTEMPTS } from "@utils/const.ts";
import { jsonResponse } from "@utils/util.ts";
import { encrypt } from "@utils/crypto.ts";
import { MAX_SECRET_SIZE } from "@utils/const.ts";
import { log } from "@utils/log.ts";
import { getBurnTimeFrame } from "@utils/date.ts";

interface Data {
  user: User | null;
}

export const handler: Handlers<Data, SessionState> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");

    log("secret", `POST /api/secret (user: ${user?.id ?? "null"})`);

    const secret = form.get("secret") as string;
    const password = form.get("secretPW") as string | null;
    const burnAfter = form.get("burnAfter") as string | null;

    if (!secret) {
      return jsonResponse({
        error: "Secret cannot be empty",
      });
    }
    if (!password) {
      return jsonResponse({
        error: "Password cannot be empty",
      });
    }

    if (secret.length > MAX_SECRET_SIZE) {
      return jsonResponse({
        error: `Secret cannot be longer than ${MAX_SECRET_SIZE} characters`,
      });
    }

    const burnParsed = burnAfter !== null ? parseInt(burnAfter, 10) : 0;
    const burnAfterCount = isNaN(burnParsed) ? 0 : burnParsed;
    const burnTimeFrame = getBurnTimeFrame(burnAfterCount);

    try {
      const { iv, cipherText } = await encrypt(
        secret,
        password,
      );
      const id = await addSecret({
        content: cipherText,
        iv,
        decryptAttempts: MAX_DECRYPT_ATTEMPTS,
        burnAfter: burnTimeFrame,
      }, user?.id ?? "");

      return jsonResponse({
        id,
        error: null,
      });
    } catch (error) {
      console.error(error);
      return jsonResponse({
        error: "Failed to add secret",
      });
    }
  },
};
