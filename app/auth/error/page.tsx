import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600">
            There was a problem signing you in. Please try again or use a
            different method.
          </p>
        </div>
      </div>
    </div>
  );
}
