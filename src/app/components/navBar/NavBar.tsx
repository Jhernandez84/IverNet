"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/utils/supabaseClients";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/hooks/useUserSession";
import { OffCanvasRightNotifications } from "./NavBarOffCanva/OffCanvasRightNotifications";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAnnouncements } from "@/hooks/useAnnouncements";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const baseNavigation = [
    {
      name: "Admin DashBoard",
      href: "/admin",
      key: "admin",
      keycurrent: true,
    },
    {
      name: "Dashboard",
      href: "/clientDashboard",
      key: "dashboard",
      keycurrent: true,
    },
    {
      name: "Finanzas",
      href: "/finances",
      key: "finanzas",
      current: false,
    },
    {
      name: "Secretaría",
      href: "/secretaria",
      key: "secretary",
      current: false,
    },
    {
      name: "Departamentos",
      href: "/ministries",
      key: "ministries",
      current: false,
    },
    {
      name: "Liderazgo",
      href: "/leadership",
      key: "leadership",
      current: false,
    },
    {
      name: "Calendario",
      href: "/calendario",
      key: "calendario",
      current: false,
    },
    {
      name: "Formularios",
      href: "/forms",
      key: "forms",
      current: false,
    },
    {
      name: "Coffee",
      href: "/coffee",
      key: "coffee",
      current: false,
    },
  ];
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [openAlerts, setOpenAlerts] = useState(false);

  const { announcements } = useAnnouncements();
  const { user, setUser, loading } = useUserSession();

  // if (loading) return null;

  const navigation = baseNavigation.filter((item) =>
    user?.access.includes(item.key)
  );

  const handleLogout = async () => {
    try {
      // 1. Sign out desde Supabase (esto intenta borrar la cookie HTTP-only también)
      const { error } = await supabase.auth.signOut();

      // 2. Siempre limpia el estado local
      localStorage.removeItem("user_session");
      setUser(null);

      // 3. 🔁 Fuerza recarga limpia para borrar cookies residuales y regenerar layout
      window.location.href = "/"; // más seguro que router.push
    } catch (err) {
      console.error("Error al cerrar sesión", err);
      alert("Error al intentar cerrar sesión");
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;

                  if (item.key === "finanzas") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Finanzas
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <MenuItem>
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Dashboard
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/finances/reports"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Reportes
                            </Link>
                          </MenuItem>
                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/finances/settings"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                Mantenedor
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  if (item.key === "secretary") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Secretaría
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          {user?.role === "admin" ? (
                            <MenuItem>
                              <Link
                                href="/secretary/announcements"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                              >
                                Comunicados
                              </Link>
                            </MenuItem>
                          ) : (
                            []
                          )}
                          <MenuItem>
                            <Link
                              href="/secretary/members"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Lista de miembros
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/secretary/listings"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Inventarios
                            </Link>
                          </MenuItem>

                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/secretary/listings/management"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                Man. Inventarios
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  if (item.key === "ministries") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Departamentos
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <MenuItem>
                            <Link
                              href="/secretary/announcements"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Mujeres
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/secretary/members"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Hombres
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/secretary/listings"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Acción Social
                            </Link>
                          </MenuItem>

                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/secretary/listings/management"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                ⚙️ Mantenedor
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  if (item.key === "calendario") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Programación
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <MenuItem>
                            <Link
                              href="/calendar"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Calendario
                            </Link>
                          </MenuItem>

                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/calendar/settings"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                Mantenedor
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  if (item.key === "leadership") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Liderazgo
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Dashboard
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Redes
                            </Link>
                          </MenuItem>

                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/leadership/management"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                Mantenedor
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  if (item.key === "coffee") {
                    return (
                      <Menu as="div" key={item.key} className="relative">
                        <div>
                          <MenuButton
                            className={classNames(
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            Coffee
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute p-0 mt-2 w-40 origin-top-left rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <MenuItem>
                            <Link
                              href="/coffee"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Punto de Venta
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Cocina
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Inventarios
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Mesón
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/leadership"
                              className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900 mb-1"
                            >
                              Reportes
                            </Link>
                          </MenuItem>
                          {user?.scopedBySede === true ? (
                            []
                          ) : (
                            <MenuItem>
                              <Link
                                href="/leadership/management"
                                className="block px-4 py-2 text-sm text-white rounded bg-gray-700 hover:bg-gray-900"
                              >
                                Mantenedor
                              </Link>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              onClick={() => setOpenAlerts(true)}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              {announcements.length > 0 ? (
                <BellIcon aria-hidden="true" className="size-6" />
              ) : (
                []
              )}
              {/* <BellIcon aria-hidden="true" className="size-6" /> */}
            </button>
            {/* Notificación Dropdown */}
            {/* <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <Link
                    key="myaccount"
                    href="/myaccount"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Mi Cuenta
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    key="settings"
                    href="settings"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu> */}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  {user?.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.full_name?.charAt(0) ?? "?"}
                    </div>
                  )}
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <Link
                    key="myaccount"
                    href="/myaccount"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Mi Cuenta
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    key="settings"
                    href="settings"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <OffCanvasRightNotifications
          open={openAlerts}
          setOpen={setOpenAlerts}
          crear={false}
        />
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
