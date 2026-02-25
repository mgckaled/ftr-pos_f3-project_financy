import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lazy, Suspense, type ReactNode } from "react";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const Categories = lazy(() => import("@/pages/Categories"));
const Profile = lazy(() => import("@/pages/Profile"));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          {/* Públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
