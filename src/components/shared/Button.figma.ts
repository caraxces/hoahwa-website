// url=https://www.figma.com/design/9soqpfUEBTJTfhMmYtI9RV/Untitled?node-id=1-1260
// source=src/components/shared/Button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label") ?? "Contact";

export default {
  example: figma.code`<Button href="/contact">${label}</Button>`,
  imports: ['import { Button } from "@/components/shared/Button"'],
  id: "wiro-button-contact",
  metadata: { nestable: true },
};
