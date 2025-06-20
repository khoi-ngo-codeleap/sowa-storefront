import SigninForm from "../components/SigninForm";

const Signin = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <SigninForm className="w-[768px] max-w-full" />
    </div>
  );
};

export default Signin;
