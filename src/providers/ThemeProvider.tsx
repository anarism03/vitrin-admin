import React from "react";
import { ConfigProvider } from "antd";
import { useAppTheme } from "../hooks/useAppTheme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useAppTheme();

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
