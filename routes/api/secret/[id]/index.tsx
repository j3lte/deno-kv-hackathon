import { Handlers } from "$fresh/server.ts";
import { getUserBySession, updateSecretAttempts } from "@utils/db.ts";
import { SessionState, User } from "@utils/types.ts";
import { getSecretFromContext, isAdmin, jsonResponse } from "@utils/util.ts";
import { decrypt } from "@utils/crypto.ts";
import { deleteSecret } from "@utils/db.ts";
import { log } from "@utils/log.ts";

interface Data {
  user: User | null;
}

export const handler: Handlers<Data, SessionState> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const password = form.get("secretPW") as string | null;
    const secret = await getSecretFromContext(ctx);

    if (!secret) {
      return jsonResponse({
        error: "Unknown secret",
      });
    }

    if (!password) {
      return jsonResponse({
        error: "Password cannot be empty",
      });
    }

    log("secret", `POST /api/secret/${secret.id} (user: ${secret.uid})`);

    try {
      const decrypted = await decrypt(secret.content, secret.iv, password);

      if (!decrypted) {
        await updateSecretAttempts(secret.id, secret.decryptAttempts - 1);
        return jsonResponse({
          updateAttempts: true,
          error: "Failed to decrypt",
        });
      }

      await deleteSecret(secret.id);
      return jsonResponse({
        content: decrypted,
      });
    } catch (error) {
      console.error(error);
      return jsonResponse({
        error: "Failed to decrypt",
      });
    }
  },
  async DELETE(_req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    const secret = await getSecretFromContext(ctx);

    if (!secret) {
      return jsonResponse({
        error: "Unknown secret",
      });
    }

    if (!user) {
      return jsonResponse({
        error: "Unknown user",
      });
    }

    log("secret", `DELETE /api/secret/${secret.id} (user: ${user.id})`);

    if (isAdmin(user.id)) {
      await deleteSecret(secret.id);
      return jsonResponse({
        deleted: true,
      });
    }

    if (user.id !== secret.uid) {
      return jsonResponse({
        error: "Unauthorized",
      });
    }

    await deleteSecret(secret.id);
    return jsonResponse({
      deleted: true,
    });
  },
};
