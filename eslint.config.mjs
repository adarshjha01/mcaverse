import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // This disables the "Unexpected any" errors
      "@typescript-eslint/no-explicit-any": "off",
      // This disables the strict rules around @ts-ignore and @ts-expect-error
      "@typescript-eslint/ban-ts-comment": "off"
    }
  }
];

export default eslintConfig;