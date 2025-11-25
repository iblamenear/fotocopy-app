"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to 'theme' for normal users
  let storageKey = "theme";

  // Use different keys for admin and courier
  if (pathname?.startsWith("/admin")) {
    storageKey = "theme-admin";
  } else if (pathname?.startsWith("/courier")) {
    storageKey = "theme-courier";
  }

  // Prevent hydration mismatch by not rendering until mounted, 
  // or accept that the initial render might match server (system/light)
  // However, changing storageKey dynamically might cause issues if not handled carefully.
  // NextThemesProvider handles updates when props change.

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      storageKey={storageKey}
      // Force re-initialization when key changes by using key prop? 
      // NextThemesProvider might not react to storageKey change automatically if it's not designed to.
      // Let's try adding a key prop to force remounting of the provider when storageKey changes.
      key={storageKey} 
    >
      {children}
    </NextThemesProvider>
  );
}
