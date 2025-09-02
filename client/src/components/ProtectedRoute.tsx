import { useEffect } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
      setLocation("/"); // redirect to login
    }
  }, [setLocation]);

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated || isAuthenticated !== "true") {
    return null; // while redirecting
  }

  return <>{children}</>;
}
