"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [onTop, setOnTop] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Get position of scroll
  useEffect(() => {
    const checkIfOnTop = () => {
      const position = window.scrollY;
      setOnTop(position);
    };
    checkIfOnTop();

    const checkIfNavShouldClose = () => {
      const size = window.screen.width;
      if (size > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", checkIfOnTop);
    window.addEventListener("resize", checkIfNavShouldClose);

    return () => {
      window.removeEventListener("scroll", checkIfOnTop);
      window.removeEventListener("resite", checkIfNavShouldClose);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full shadow-md shadow-black/20 transition-all duration-500 ${
        onTop <= 80 ? "bg-transparent" : `bg-[#6c3ec9]/90`
      }`}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/** LOGO */}
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block focus:ring-4 focus:ring-purple-500" href="/">
              <span className="sr-only">Home</span>
              <div className="relative mx-auto flex w-fit justify-center overflow-clip ">
                <Image
                  src={"/logo.svg"}
                  alt="EUSE logo"
                  width={40}
                  height={40}
                />
              </div>
            </Link>
          </div>

          {/** NAVIGATION ITEMS */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    className="text-white transition hover:text-white/75 focus:outline-4 focus:outline-purple-500"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/** BUTTONS */}
          <div className="block md:hidden">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/** MOBILE MENU */}
          <div
            className={`fixed left-0 top-0 z-[60] flex h-screen w-full flex-col justify-between overscroll-auto border-e bg-white transition-all duration-300 md:hidden ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="w-full px-4 py-6">
              <div className="flex w-full justify-end">
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="rounded bg-gray-100 text-gray-500 transition hover:text-gray-600/75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <g id="Edit / Close_Square">
                      <path
                        id="Vector"
                        d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </button>
              </div>

              <ul className="mt-6 space-y-3">
                <li>
                  <Link
                    href="/"
                    className={`block rounded-lg px-4 py-3 font-medium ${
                      pathname === "/" && "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href=""
                    className={`block rounded-lg px-4 py-3 font-medium ${
                      pathname === "/something-else" &&
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Something else
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
