import React from "react";
import AppRoutes from "./routes/Routes";
import Toast from "./components/Toast";

export default function App() {
  return (
    <div className="pt-16">
      <AppRoutes />
       <Toast />
    </div>
  );
}
