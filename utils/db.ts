import "$std/dotenv/load.ts";

import {
  Secret,
  SecretData,
  SecretWithExtra,
  Stats,
  User,
  WithBurnStatus,
} from "./types.ts";
import { KV_SET } from "./const.ts";
import { log } from "./log.ts";
import { getBurnStatus } from "@utils/date.ts";

const kv = await Deno.openKv(Deno.env.get("KV_SECRET_STORE")!);

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

export async function listUsers(): Promise<User[]> {
  const iter = await kv.list<User>({ prefix: [KV_SET.USERS] });
  const users: User[] = [];
  for await (const item of iter) {
    users.push(item.value);
  }
  return users;
}

async function getUniqueId(): Promise<string> {
  const uuid = crypto.randomUUID();
  const existingSecret = await kv.get<Secret>([KV_SET.SECRETS, uuid]);
  if (existingSecret.value) {
    return await getUniqueId();
  }
  return uuid;
}

export async function addSecret(
  data: SecretData,
  uid: string | null,
) {
  const id = await getUniqueId();
  const user = uid ? await getUserById(uid) : null;

  log("db", "addSecret", id, user?.id);

  const secret: Secret = {
    ...data,
    id,
    uid: user?.id || null,
    createdAt: new Date().toISOString(),
  };

  await kv.set([KV_SET.SECRETS, id], secret);
  if (user) {
    await kv.set([KV_SET.SECRETS_BY_USER, user.id, id], secret);
  }

  await addCreatedToStats();

  return id;
}

export async function getSecret(
  id: string,
): Promise<Secret & WithBurnStatus | null> {
  const res = await kv.get<Secret>([KV_SET.SECRETS, id]);

  log("db", "getSecret", id);

  if (!res.value) return null;

  const burnStatus = getBurnStatus(res.value.createdAt, res.value.burnAfter);

  return {
    ...res.value,
    burnStatus,
  };
}

export async function listSecrets(): Promise<SecretWithExtra[]> {
  const iter = await kv.list<Secret>(
    { prefix: [KV_SET.SECRETS] },
    { reverse: true },
  );
  const secrets: SecretWithExtra[] = [];
  for await (const item of iter) {
    const user = item.value.uid ? await getUserById(item.value.uid) : null;
    const burnStatus = getBurnStatus(
      item.value.createdAt,
      item.value.burnAfter,
    );

    secrets.push({
      ...item.value,
      user,
      burnStatus,
    });
  }
  return secrets;
}

export async function listSecretsByUser(
  uid: string,
): Promise<SecretWithExtra[]> {
  const user = await getUserById(uid);
  const iter = await kv.list<Secret>(
    { prefix: [KV_SET.SECRETS_BY_USER, uid] },
    { reverse: true },
  );
  const secrets: SecretWithExtra[] = [];
  for await (const item of iter) {
    const burnStatus = getBurnStatus(
      item.value.createdAt,
      item.value.burnAfter,
    );

    secrets.push({
      ...item.value,
      user,
      burnStatus,
    });
  }
  return secrets;
}

export async function deleteSecret(id: string) {
  const secret = await getSecret(id);
  if (!secret) return;

  log("db", "deleteSecret", id);

  await kv.delete([KV_SET.SECRETS, id]);
  if (secret.uid) {
    await kv.delete([KV_SET.SECRETS_BY_USER, secret.uid, id]);
  }

  await addBurnedToStats();
}

export async function updateSecretAttempts(id: string, attempts: number) {
  const secret = await getSecret(id);
  if (!secret) return;

  log("db", "updateSecretAttempts", id, attempts);

  await kv.set([KV_SET.SECRETS, id], {
    ...secret,
    decryptAttempts: attempts,
  });
}

export async function getStats(): Promise<Stats> {
  const res = await kv.get<Stats>([KV_SET.STATS]);
  if (!res.value) {
    return {
      created: 0,
      burned: 0,
    };
  }
  return res.value;
}

export async function addCreatedToStats(): Promise<void> {
  const stats = await getStats();
  await kv.set([KV_SET.STATS], {
    ...stats,
    created: stats.created + 1,
  });
}

export async function addBurnedToStats(): Promise<void> {
  const stats = await getStats();
  await kv.set([KV_SET.STATS], {
    ...stats,
    burned: stats.burned + 1,
  });
}
