import { ThemeConfig } from "antd";

export const useAppTheme = (): ThemeConfig => {
  return {
    token: {
      colorPrimary: "#2563eb",
      borderRadius: 8,
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
  };
};
