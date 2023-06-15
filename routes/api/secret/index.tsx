import { Handlers } from "$fresh/server.ts";
import { addSecret, getUserBySession } from "@utils/db.ts";
import { SessionState, User } from "@utils/types.ts";
import { jsonResponse } from "@utils/util.ts";
import { encrypt } from "@utils/crypto.ts";

interface Data {
  user: User | null;
}

const encryptDataIfNeeded = async (
  data: string,
  password: string | null,
): Promise<{ iv: string; content: string; encrypted: boolean }> => {
  if (!password) {
    return {
      iv: "",
      content: data,
      encrypted: false,
    };
  }

  const encrypted = await encrypt(data, password);
  return {
    iv: encrypted.iv,
    content: encrypted.cipherText,
    encrypted: true,
  };
};

export const handler: Handlers<Data, SessionState> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");

    const secret = form.get("secret") as string;
    const password = form.get("secretPW") as string | null;

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

    try {
      const { iv, content, encrypted } = await encryptDataIfNeeded(
        secret,
        password,
      );
      const id = await addSecret({
        content,
        iv,
        encrypted,
        burnAfterReading: true,
        decryptAttempts: 3,
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
