// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EmployeePage from "./pages/EmployeePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const db = getFirestore();

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  employeeId: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const ref = doc(db, "employees", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUser({
            uid,
            name: data.name,
            email: data.email,
            role: data.role,
            employeeId: data.employeeId,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute userRole={user?.role || null} allowedRoles={["admin", "employee"]}>
            {user?.role === "admin"
              ? <AdminDashboardPage currentUser={user} />
              : <EmployeePage currentUser={user} />}
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
