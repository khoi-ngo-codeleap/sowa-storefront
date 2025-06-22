import SigninForm from "../components/SigninForm";

const Signin = () => {
  return (
    <main className="bg-[#fef4de69] min-h-svh flex flex-col items-center justify-center text-center  p-6 md:p-10">
      <SigninForm className="w-[768px] max-w-full" />
    </main>
  );
};

export default Signin;
