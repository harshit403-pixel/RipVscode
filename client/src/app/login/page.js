import GuestRoute from "@/features/auth/ui/jsx/GuestRoute";
import LoginForm from "@/features/auth/ui/jsx/LoginForm";

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}
