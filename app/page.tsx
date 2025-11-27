import Link from "next/link";
import JobList from "./components/JobList";
import { PlusIcon } from "@heroicons/react/24/outline";


export default function Home() {



  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Link
        href="/create-job"
        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Post Job</span>
      </Link>
      <div className="max-w-4xl mx-auto">
        <JobList />

      </div>

    </div>
  );
}
