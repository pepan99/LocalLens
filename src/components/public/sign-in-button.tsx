import { signIn } from "@/auth";
import { Button } from "../ui/button";

export const SignInButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signIn("github");
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-gray-100"
        type="submit"
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInButton;
