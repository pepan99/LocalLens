"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };
  return (
    <Button
      variant="outline"
      className="bg-white text-black hover:bg-gray-100"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
