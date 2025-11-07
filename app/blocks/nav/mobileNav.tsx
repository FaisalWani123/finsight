'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Home, LayoutDashboard, User, } from 'lucide-react';
import { usePathname } from 'next/navigation';


export default function MobileNav() {
  const [showHeader, setShowHeader] = useState(true);
  // Use a ref to persist the last scroll value between renders
  const lastScrollYRef = useRef(0);

  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const origin = "protected";
  const items = [
    {
      title: "Home",
      url: `/${origin}/home`,
      icon: Home,
    },
    {
      title: "Finances",
      url: `/${origin}/finances`,
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: `/${origin}/profile`,
      icon: User,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 shadow transition-transform duration-300 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top bar with title and actions */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-black">
        <div className={`text-2xl font-bold dark:text-white`}>
          FinSight.
        </div>
        <div className="flex items-center space-x-5">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Tabs row */}
      <nav className="bg-white dark:bg-black">
        <div className="flex items-center justify-between space-x-8 overflow-x-auto p-2 px-6 md:px-40">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center p-2 whitespace-nowrap rounded transition-colors 
                ${path === item.url ? 'outline-1 outline-slate-500 text-black dark:text-white' : 'text-gray-600'}
                hover:text-black dark:hover:text-white`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}