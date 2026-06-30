import GuestRoute from "@/features/auth/ui/jsx/GuestRoute";
import SignupForm from "@/features/auth/ui/jsx/SignupForm";

export default function SignupPage() {
  return (
    <GuestRoute>
      <SignupForm />
    </GuestRoute>
  );
}
