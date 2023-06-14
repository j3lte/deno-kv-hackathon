import { Secret, SecretData, User } from "./types.ts";
import { KV_SET } from "./const.ts";

const kv = await Deno.openKv();

export async function setUserWithSession(user: User, session: string) {
  await kv
    .atomic()
    .set([KV_SET.USERS, user.id], user)
    .set([KV_SET.USERS_BY_LOGIN, user.login], user)
    .set([KV_SET.USERS_BY_SESSION, session], user)
    .set([KV_SET.USERS_BY_LAST_SIGNIN, new Date().toISOString(), user.id], user)
    .commit();
}

export async function getUserBySession(session: string) {
  const res = await kv.get<User>([KV_SET.USERS_BY_SESSION, session]);
  return res.value;
}

export async function getUserById(id: string) {
  const res = await kv.get<User>([KV_SET.USERS, id]);
  return res.value;
}

export async function getUserByLogin(login: string) {
  const res = await kv.get<User>([KV_SET.USERS_BY_LOGIN, login]);
  return res.value;
}

export async function deleteSession(session: string) {
  await kv.delete([KV_SET.USERS_BY_SESSION, session]);
}

export async function addSecret(
  data: SecretData,
  encryptionKey: string | null,
  uid: string | null,
) {
  const uuid = crypto.randomUUID();
  const id = new Date().getTime() + "-" + uuid;
  const user = uid ? await getUserById(uid) : null;

  const secret: Secret = {
    ...data,
    id,
    uid: user?.id || null,
  };

  await kv.set([KV_SET.SECRETS, id], secret);
  if (user) {
    await kv.set([KV_SET.SECRETS_BY_USER, user.id, id], secret);
  }

  return true;
}

export async function getSecret(id: string): Promise<Secret | null> {
  const res = await kv.get<Secret>([KV_SET.SECRETS, id]);
  return res.value || null;
}

export async function getSecretsByUser(uid: string): Promise<Secret[]> {
  const iter = await kv.list<Secret>(
    { prefix: [KV_SET.SECRETS_BY_USER, uid] },
    { reverse: true },
  );
  const secrets: Secret[] = [];
  for await (const item of iter) {
    secrets.push(item.value);
  }
  return secrets;
}

export async function deleteSecret(id: string) {
  const secret = await getSecret(id);
  if (!secret) return;

  await kv.delete([KV_SET.SECRETS, id]);
  if (secret.uid) {
    await kv.delete([KV_SET.SECRETS_BY_USER, secret.uid, id]);
  }
}
