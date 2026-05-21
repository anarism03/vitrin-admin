import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App, Avatar, Button, Layout as AntLayout, Menu, Tooltip } from "antd";
import {
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AuthService from "../services/AuthService";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserDisplayName } from "../utils/authUser";

const { Header, Sider, Content } = AntLayout;

const MENU = [
  { key: "/", label: "Dashboard", icon: <AppstoreOutlined /> },
  { key: "/products", label: "Məhsullar", icon: <ShoppingOutlined /> },
  { key: "/categories", label: "Kateqoriyalar", icon: <TagsOutlined /> },
];

const MOBILE_QUERY = "(max-width: 1023px)";
const SIDEBAR_WIDTH = 240;

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.auth.user);
  const userEmail = useAppSelector((state) => state.auth.userEmail);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_QUERY).matches,
  );

  const selectedKey = MENU.some((item) => item.key === location.pathname)
    ? location.pathname
    : "/";
  const pageTitle = MENU.find((item) => item.key === selectedKey)?.label;
  const displayEmail = user?.email || userEmail;
  const sidebarWidth = isMobile
    ? mobileOpen
      ? SIDEBAR_WIDTH
      : 0
    : collapsed
      ? 80
      : SIDEBAR_WIDTH;

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) setMobileOpen(false);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const goToPage = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {
      message.warning("Server çıxışı alınmadı, lokal sessiya bağlandı");
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const toggleMenu = () => {
    if (isMobile) {
      setMobileOpen((value) => !value);
      return;
    }

    setCollapsed((value) => !value);
  };

  return (
    <AntLayout className="min-h-screen bg-slate-50">
      {isMobile && mobileOpen ? (
        <button
          type="button"
          aria-label="Menyunu bağla"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30"
        />
      ) : null}

      <Sider
        trigger={null}
        collapsible
        collapsed={!isMobile && collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={SIDEBAR_WIDTH}
        className="app-sidebar !fixed !bottom-0 !left-0 !top-0 !z-40 !bg-white !shadow-lg"
        style={{
          transform:
            isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="flex h-full flex-col border-r border-slate-200">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
            <Avatar shape="square" className="!bg-blue-600">
              A
            </Avatar>
            {(!collapsed || isMobile) && (
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-semibold text-slate-950">
                  Admin Panel
                </p>
                <p className="m-0 text-xs text-slate-500">v1.0.0</p>
              </div>
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={MENU}
            onClick={({ key }) => goToPage(key)}
            className="!mt-3 !border-0"
          />

          <div className="mt-auto border-t border-slate-200 p-3">
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="!h-10"
            >
              {collapsed && !isMobile ? "" : "Çıxış et"}
            </Button>
          </div>
        </div>
      </Sider>

      <AntLayout
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Header className="!sticky !top-0 !z-20 !flex !h-16 !items-center !justify-between !border-b !border-slate-200 !bg-white !px-4 !leading-none">
          <div className="flex min-w-0 items-center gap-3">
            <Tooltip title={isMobile ? "Menyu" : collapsed ? "Aç" : "Bağla"}>
              <Button
                type="text"
                icon={
                  collapsed && !isMobile ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )
                }
                onClick={toggleMenu}
                className="!flex !h-10 !w-10 !items-center !justify-center"
              />
            </Tooltip>

            <h1 className="m-0 truncate text-base font-semibold text-slate-950">
              {pageTitle}
            </h1>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="!bg-slate-900" icon={<UserOutlined />} />
            <span className="hidden min-w-0 max-w-56 flex-col leading-tight sm:flex">
              <span className="truncate text-sm font-semibold text-slate-800">
                {getUserDisplayName(user)}
              </span>
              {displayEmail ? (
                <span className="truncate text-xs text-slate-500">
                  {displayEmail}
                </span>
              ) : null}
            </span>
          </div>
        </Header>

        <Content className="min-h-[calc(100vh-64px)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
