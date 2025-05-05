import FloatingContainer from "@/components/public/floating-container";
import SignInButton from "@/components/public/sign-in-button";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/persistent-map"), {
  loading: () => (
    <p className="flex h-screen w-screen items-center justify-center">
      Loading Map...
    </p>
  ), // Optional loading indicator
});

const LoginPage = () => {
  return (
    <>
      <div className="-z-10 inset-0 fixed bg-gray-50">
        <Map />
      </div>

      {/* Main content with higher z-index */}
      <main className="z-10 min-h-screen flex items-center justify-center">
        <FloatingContainer className="h-fit flex flex-col items-center justify-center">
          <h1 className="text-2xl">Welcome to LocalLens!</h1>
          <p className="pb-5">To continue please sign in</p>
          <SignInButton />
        </FloatingContainer>
      </main>
    </>
  );
};

export default LoginPage;
