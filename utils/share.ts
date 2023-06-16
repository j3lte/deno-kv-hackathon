import { IS_BROWSER } from "$fresh/runtime.ts";

// Borrowed from https://github.com/nygardk/react-share/blob/master/src/utils/objectToGetParams.ts#L1

const objectToGetParams = (object: {
  [key: string]: string | number | undefined | null;
}): string => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length > 0 ? `?${params.join("&")}` : "";
};

const isMobileOrTablet = (): boolean => {
  if (!IS_BROWSER) return false;
  return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
};

export const whatsappLink = (url: string): string => (
  "https://" +
  (isMobileOrTablet() ? "api" : "web") +
  ".whatsapp.com/send" +
  objectToGetParams({
    text: url,
  })
);

export const telegramLink = (url: string): string =>
  "https://t.me/share/url" + objectToGetParams({ url });

export const emailLink = (url: string) =>
  "mailto:" + objectToGetParams({ body: url });
