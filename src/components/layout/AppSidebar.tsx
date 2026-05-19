import type { ReactNode } from "react";
import { Avatar, Button, Layout, Menu, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudServerOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

type MenuEntry = {
  key: string;
  path: string;
  label: string;
  icon: ReactNode;
};

type MenuSection = {
  title: string;
  items: MenuEntry[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Əsas",
    items: [
      { key: "dashboard", path: "/", icon: <AppstoreOutlined />, label: "Dashboard" },
      { key: "products", path: "/products", icon: <ShoppingOutlined />, label: "Məhsullar" },
      { key: "categories", path: "/categories", icon: <TagsOutlined />, label: "Kateqoriyalar" },
      { key: "users", path: "/users", icon: <TeamOutlined />, label: "İstifadəçilər" },
      { key: "stats", path: "/stats", icon: <BarChartOutlined />, label: "Statistika" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { key: "settings", path: "/settings", icon: <SettingOutlined />, label: "Parametrlər" },
      { key: "logs", path: "/logs", icon: <CloudServerOutlined />, label: "API loglar" },
    ],
  },
];

const MENU_ITEMS = MENU_SECTIONS.flatMap((section) => section.items);

export function getDashboardTitle(pathname: string) {
  return MENU_ITEMS.find((item) => item.path === pathname)?.label || "Dashboard";
}

type AppSidebarProps = {
  collapsed: boolean;
  isMobile: boolean;
  loggingOut: boolean;
  mobileOpen: boolean;
  onLogout: () => void;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
};

const buildMenuItems = (collapsed: boolean): MenuProps["items"] => {
  const toMenuItem = (item: MenuEntry) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    title: item.label,
  });

  if (collapsed) {
    return MENU_ITEMS.map(toMenuItem);
  }

  return MENU_SECTIONS.map((section) => ({
    key: section.title,
    type: "group" as const,
    label: section.title,
    children: section.items.map(toMenuItem),
  }));
};

export default function AppSidebar({
  collapsed,
  isMobile,
  loggingOut,
  mobileOpen,
  onLogout,
  onMobileClose,
  onToggleCollapse,
}: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCollapsed = isMobile ? false : collapsed;
  const activeKey =
    MENU_ITEMS.find((item) => item.path === location.pathname)?.key ||
    "dashboard";

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const item = MENU_ITEMS.find((menuItem) => menuItem.key === key);

    if (item) {
      navigate(item.path);
    }

    if (isMobile) {
      onMobileClose();
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      collapsedWidth={isMobile ? 0 : 80}
      width={isMobile ? 288 : 256}
      className="app-sidebar !border-r !border-slate-200 !bg-white !shadow-2xl !shadow-slate-950/10 lg:!shadow-none"
      style={{
        position: isMobile ? "fixed" : "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        height: "100dvh",
        maxHeight: "100dvh",
        zIndex: 40,
        transform:
          isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
        transition:
          "width 320ms cubic-bezier(0.22, 1, 0.36, 1), min-width 320ms cubic-bezier(0.22, 1, 0.36, 1), max-width 320ms cubic-bezier(0.22, 1, 0.36, 1), flex-basis 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
      }}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={[
            "flex shrink-0 border-b border-slate-200 transition-all duration-300 ease-out",
            isCollapsed
              ? "h-24 flex-col items-center justify-center gap-2 px-0"
              : "h-16 items-center justify-between px-4",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              shape="square"
              size={40}
              className="!flex !shrink-0 !items-center !justify-center !rounded-lg !bg-blue-600 !text-base !font-bold"
            >
              A
            </Avatar>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-semibold text-slate-950">
                  Admin Panel
                </p>
                <p className="m-0 text-xs text-slate-500">v1.0.0</p>
              </div>
            )}
          </div>

          {isMobile ? (
            <Button
              type="text"
              aria-label="Menyunu bağla"
              icon={<MenuFoldOutlined />}
              onClick={onMobileClose}
              className="!flex !h-9 !w-9 !items-center !justify-center !rounded-lg"
            />
          ) : (
            <Tooltip title={isCollapsed ? "Menyunu aç" : "Menyunu bağla"}>
              <Button
                type="text"
                aria-label={isCollapsed ? "Menyunu aç" : "Menyunu bağla"}
                icon={
                  isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={onToggleCollapse}
                className="!flex !h-9 !w-9 !items-center !justify-center !rounded-lg"
              />
            </Tooltip>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-3">
          <Menu
            mode="inline"
            inlineCollapsed={isCollapsed}
            selectedKeys={[activeKey]}
            items={buildMenuItems(isCollapsed)}
            onClick={handleMenuClick}
            className="!border-0 !px-2"
          />
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white p-3">
          {isCollapsed ? (
            <Tooltip title="Çıxış et" placement="right">
              <Button
                danger
                type="text"
                aria-label="Çıxış et"
                icon={<LogoutOutlined />}
                loading={loggingOut}
                onClick={onLogout}
                className="!flex !h-11 !w-full !items-center !justify-center !rounded-lg"
              />
            </Tooltip>
          ) : (
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              loading={loggingOut}
              onClick={onLogout}
              className="!h-10 !rounded-lg !font-medium"
            >
              Çıxış et
            </Button>
          )}
        </div>
      </div>
    </Sider>
  );
}
