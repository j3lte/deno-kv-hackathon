import { decode as hd, encode as he } from "$std/encoding/hex.ts";

const encodeText = (s: string) => new TextEncoder().encode(s);
const decodeText = (d: Uint8Array) => new TextDecoder().decode(d);

const generateIV = () => crypto.getRandomValues(new Uint8Array(16));

const sha256 = async (data: string) => {
  const encoded = encodeText(data);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return new Uint8Array(hash);
};

const generateKey = async (cipherKey: string) => {
  const rawKey = await sha256(cipherKey);

  const key = await crypto.subtle.importKey(
    "raw",
    rawKey.buffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  );
  return key;
};

export const encrypt = async (data: string, cipherKey: string) => {
  const encoded = encodeText(data);
  const iv = generateIV();
  const key = await generateKey(cipherKey);
  const cipher = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded,
  );
  const cipherBytes = new Uint8Array(cipher);
  const hexBytes = decodeText(he(cipherBytes));
  const hexIV = decodeText(he(iv));
  return {
    cipherText: hexBytes,
    iv: hexIV,
  };
};

export const decrypt = async (
  cipherText: string,
  hexIv: string,
  cipherKey: string,
): Promise<string | null> => {
  try {
    const key = await generateKey(cipherKey);
    const iv = hd(encodeText(hexIv));
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      hd(encodeText(cipherText)),
    );
    const decryptedBytes = new Uint8Array(decrypted);
    const decryptedText = decodeText(decryptedBytes);
    return decryptedText;
    // deno-lint-ignore no-empty
  } catch (_error) {}
  return null;
};
