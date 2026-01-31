/**
 * Route Transition Component
 * Provides smooth transitions between route changes
 */

import { useEffect, useState, useTransition } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoader } from './Loader';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [, setLocation] = useState(location.pathname);

  useEffect(() => {
    startTransition(() => {
      setLocation(location.pathname);
    });
  }, [location.pathname]);

  if (isPending) {
    return <PageLoader message="Loading page..." />;
  }

  return <div className="animate-fadeIn">{children}</div>;
}
