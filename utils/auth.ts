import "$std/dotenv/load.ts";
import { createGitHubOAuth2Client } from "kv_oauth";

export const client = createGitHubOAuth2Client();
