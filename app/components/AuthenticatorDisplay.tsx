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

  const calculateCircumference = (radius: number) => {
    return 2 * Math.PI * radius;
  };

  const radius = 40;
  const circumference = calculateCircumference(radius);
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

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
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-black1 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <p className="text-4xl font-mono text-center mb-4">{authCode?.code || '------'}</p>
            <Button onClick={fetchCode} className="w-full mt-4">
              Refresh Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

