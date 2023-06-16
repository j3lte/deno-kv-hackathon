import { JSX } from "preact";

import {
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconMail,
} from "@utils/icons.ts";
import { emailLink, telegramLink, whatsappLink } from "@utils/share.ts";

interface ShareButtonProps {
  type: "whatsapp" | "telegram" | "email";
  url: string;
}

export default function ShareButton(
  { type, url }: ShareButtonProps,
): JSX.Element {
  const share = () => {
    switch (type) {
      case "whatsapp":
        window.open(whatsappLink(url));
        break;
      case "telegram":
        window.open(telegramLink(url));
        break;
      case "email":
        window.open(emailLink(url));
        break;
    }
  };

  return (
    <div>
      <button
        class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
        title={`Share: ${type}`}
        onClick={share}
      >
        {type === "whatsapp" && <IconBrandWhatsapp />}
        {type === "telegram" && <IconBrandTelegram />}
        {type === "email" && <IconMail />}
      </button>
    </div>
  );
}
