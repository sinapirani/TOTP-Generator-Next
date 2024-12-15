'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCode {
  code: string;
  generatedAt: number;
  expiresAt: number;
}

export default function AuthenticatorDisplay() {
  const [authCode, setAuthCode] = useState<AuthCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchCode = useCallback(async () => {
    try {
      const response = await fetch('/api/auth-code');
      if (!response.ok) {
        throw new Error('Failed to fetch authentication code');
      }
      const data = await response.json();
      setAuthCode(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch authentication code');
      setAuthCode(null);
    }
  }, []);

  useEffect(() => {
    fetchCode();
    const interval = setInterval(fetchCode, 30000); // Fetch new code every 30 seconds

    return () => clearInterval(interval);
  }, [fetchCode]);

  useEffect(() => {
    if (authCode) {
      const updateTimeLeft = () => {
        const now = Math.floor(Date.now() / 1000);
        const newTimeLeft = Math.max(0, authCode.expiresAt - now);
        setTimeLeft(newTimeLeft);

        if (newTimeLeft === 0) {
          fetchCode();
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);

      return () => clearInterval(interval);
    }
  }, [authCode, fetchCode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Instagram Authentication Code</CardTitle>
        <CardDescription>Use this code to log in to Instagram</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-4xl font-mono text-center mb-4">{authCode?.code || '------'}</p>
            <p className="text-center mb-4">Code refreshes in: {formatTime(timeLeft)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
            <Button onClick={fetchCode} className="w-full">
              Refresh Code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

