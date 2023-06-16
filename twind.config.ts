import { Options } from "$fresh/plugins/twind.ts";

const opts: Options = {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
  },
};

export default opts;
