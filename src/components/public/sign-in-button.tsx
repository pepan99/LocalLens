"use client";

import { useRouter } from "next/navigation"; // Changed from next/router
import { Button } from "../ui/button";

const SignInButton = () => {
  const router = useRouter();
  const handleSignIn = async () => {
    router.push("/api/auth/signin");
  };
  return (
    <Button
      variant="outline"
      className="bg-white text-black hover:bg-gray-100"
      onClick={handleSignIn}
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
