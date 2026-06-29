import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { LockKeyhole } from "lucide-react";

export default function ResetPassword() {
  return (
    <AuthLayout
      icon={LockKeyhole}
      title="Reset Password"
      subtitle="Complete password reset"
      footer={<Link to="/login" className="text-primary hover:text-primary/80">Back to sign in</Link>}
    >
      <div className="text-sm text-muted-foreground">Reset form can now call the backend service.</div>
    </AuthLayout>
  );
}
