import React, { useEffect, useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { PostEditor } from './components/PostEditor';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
import { config } from './config/github';
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        !localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    }
    return false;
  });
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  const themeToggle =
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setIsDark(!isDark)}
    className="h-9 w-9 text-muted-foreground hover:text-foreground"
    aria-label="Переключить тему">
    
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>;

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          onLogin={() => setIsAuthenticated(true)}
          themeToggle={themeToggle} />
        
        <Toaster position="top-center" />
      </>);

  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-bold text-base sm:text-lg">Hugo Admin</span>
            <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline-block">
              {config.GITHUB_OWNER}/{config.GITHUB_REPO}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {themeToggle}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAuthenticated(false)}
              className="text-muted-foreground hover:text-foreground h-9 px-2 sm:px-3">
              
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline-block">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <PostEditor />
      </main>

      <Toaster position="top-center" />
    </div>);

}