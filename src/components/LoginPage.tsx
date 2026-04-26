import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from
'./ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { config } from '../config/github';
import { toast } from 'sonner';
interface LoginPageProps {
  onLogin: () => void;
  themeToggle: React.ReactNode;
}
export function LoginPage({ onLogin, themeToggle }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === config.ADMIN_USERNAME) {
      onLogin();
    } else {
      toast.error('Неверное имя пользователя');
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">{themeToggle}</div>
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Hugo Admin
          </CardTitle>
          <CardDescription className="text-sm">
            Введите имя пользователя для доступа
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus />
              
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);

}