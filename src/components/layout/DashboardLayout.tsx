import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App as AntApp, Avatar, Dropdown } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import AppSidebar, { getDashboardTitle } from "./AppSidebar";
import { useAuth } from "../../auth/AuthContext";
import { AuthService } from "../../services/AuthService";
import { getUserDisplayName, getUserInitial } from "../../utils/authUser";

const MOBILE_QUERY = "(max-width: 1023px)";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_QUERY).matches,
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);
  const email = user?.email || "";
  const pageTitle = getDashboardTitle(location.pathname);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setMobileSidebarOpen(false);
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile || !mobileSidebarOpen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [isMobile, mobileSidebarOpen]);

  useEffect(() => {
    if (!isMobile || !mobileSidebarOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile, mobileSidebarOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await AuthService.logout();
    } catch (err) {
      if (!axios.isAxiosError(err) || err.response?.status !== 401) {
        message.warning("Server çıxışı təsdiqləmədi, lokal sessiya bağlandı.");
      }
    } finally {
      logout();
      setLoggingOut(false);
      message.success("Çıxış edildi");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <AppSidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        loggingOut={loggingOut}
        mobileOpen={mobileSidebarOpen}
        onLogout={handleLogout}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />

      {isMobile && mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Menyunu bağla"
          onClick={() => setMobileSidebarOpen(false)}
          className="sidebar-backdrop fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Menyunu aç"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
            >
              <MenuOutlined />
            </button>

            <div className="min-w-0">
              <h1 className="m-0 truncate text-base font-semibold text-slate-950">
                {pageTitle}
              </h1>
              <p className="m-0 hidden text-xs text-slate-500 sm:block">
                Hesab icmalı və idarəetmə paneli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Bildirişlər"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            >
              <BellOutlined />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "Profil",
                    disabled: true,
                  },
                  { type: "divider" },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Çıxış et",
                    danger: true,
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              <button
                type="button"
                className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Avatar size={34} className="shrink-0 !bg-blue-600">
                  {initial}
                </Avatar>

                <span className="hidden min-w-0 flex-col items-start leading-tight md:flex">
                  <span className="whitespace-nowrap text-[13px] font-semibold text-slate-950">
                    {displayName}
                  </span>
                  <span className="whitespace-nowrap text-[11px] text-slate-500">
                    {email}
                  </span>
                </span>
              </button>
            </Dropdown>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-3 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
