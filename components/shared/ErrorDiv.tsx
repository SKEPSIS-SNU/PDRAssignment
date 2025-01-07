import { CircleX } from "lucide-react";

const ErrorDiv = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="text-red-500 flex flex-row items-center gap-2 flex-wrap border border-red-500 p-6 m-4 rounded-2xl bg-destructive/40 dark:bg-destructive/50">
      <CircleX className="w-10 h-10" />

      <p className="font-bold text-lg">{errorMessage}</p>
    </div>
  );
};

export default ErrorDiv;
