import { User } from "../utils/types.ts";
import { ButtonLink } from "@components/Button.tsx";

export function CreateOrLogin(props: { user: User | null; hideNew?: boolean }) {
  return (
    <div class="mt-4 flex justify-center sm:justify-end">
      {props.user
        ? (null)
        : (
          <ButtonLink href="/auth/signin" class="hover:bg-blue-600">
            Log in with GitHub
          </ButtonLink>
        )}
    </div>
  );
}
