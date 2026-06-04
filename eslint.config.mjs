// eslint.config.mjs
import next from "eslint-config-next";

export default [
  {
    ignores: ["**/dist/**", "**/.next/**"],
  },
  ...next(),
];
