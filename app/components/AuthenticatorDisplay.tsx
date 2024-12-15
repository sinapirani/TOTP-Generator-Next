'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthenticatorDisplay() {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const fetchCode = async () => {
    try {
      const response = await fetch('/api/auth-code');
      if (!response.ok) {
        throw new Error('Failed to fetch authentication code');
      }
      const data = await response.json();
      setCode(data.code);
      setError(null);
      setTimeLeft(30);
    } catch (err) {
      setError('Failed to fetch authentication code');
      setCode(null);
    }
  };

  useEffect(() => {
    fetchCode();
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          fetchCode();
          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Code</CardTitle>
        <CardDescription>Use this code to log in to Instagram</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-4xl font-mono text-center mb-4">{code || '------'}</p>
            <p className="text-center mb-4">Code refreshes in: {timeLeft} seconds</p>
            <Button onClick={fetchCode} className="w-full">
              Refresh Code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

