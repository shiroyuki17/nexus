import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { KeyRound } from "lucide-react";

export default function ForgotPassword() {
  return (
    <AuthLayout
      icon={KeyRound}
      title="Forgot Password"
      subtitle="Password reset will be handled by the backend service"
      footer={<Link to="/login" className="text-primary hover:text-primary/80">Back to sign in</Link>}
    >
      <div className="text-sm text-muted-foreground">Reset endpoint is ready to connect.</div>
    </AuthLayout>
  );
}
