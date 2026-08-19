'use client';

import { useState, useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n';
import OnboardingScreen from '@/components/OnboardingScreen';
import AppShell from '@/components/AppShell';

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('krishi-onboarded');
    setIsOnboarded(onboarded === 'true');
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('krishi-onboarded', 'true');
    setIsOnboarded(true);
  };

  if (isOnboarded === null) {
    return (
      <I18nProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-float">🌾</div>
            <div className="text-2xl font-bold text-primary-800">कृषि मित्र</div>
            <div className="text-surface-500 mt-1">Loading...</div>
          </div>
        </div>
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      {!isOnboarded ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <AppShell />
      )}
    </I18nProvider>
  );
}
