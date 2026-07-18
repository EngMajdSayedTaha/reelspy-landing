// Next.js 16 ships a native flat ESLint config — use it directly (the legacy
// `next lint` command and FlatCompat bridge were removed / are incompatible
// with ESLint 9.x here).
import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
