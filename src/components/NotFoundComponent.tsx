import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import imgUrl from "/not-found.png";
const NotFound = () => {
  return (
    <main className="bg-[#fef4de69] min-h-svh flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="max-w-md w-full">
        <img src={imgUrl} alt="404 Not Found" width={800} height={600} />
        <Button asChild className="mt-6">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
