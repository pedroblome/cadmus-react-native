import { GluestackUIProvider as Provider } from "@gluestack-ui/themed";
import theme from "../../theme/gluestack-theme.config";
import { ReactNode } from "react";

export function GluestackUIProvider({ children }: { children: ReactNode }) {
  return <Provider config={theme}>{children}</Provider>;
}
