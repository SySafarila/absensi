import AuthController from "../components/AuthController";
import Link from "next/link";
import LoadingRequired from "../components/LoginRequired";

export default function Home() {
  const Auth = AuthController();

  return (
    <LoadingRequired>
      <div className="flex justify-center h-screen items-center bg-gray-100 flex-col gap-2">
        <Link href="/classes/create">
          <a className="bg-white w-[10rem] border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold text-center">
            Buat Kelas
          </a>
        </Link>
        <Link href="/classes">
          <a className="bg-white w-[10rem] border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold text-center">
            Daftar Kelas
          </a>
        </Link>
        <button
          className="bg-white w-[10rem] border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold"
          onClick={Auth.logout}
        >
          Logout
        </button>
      </div>
    </LoadingRequired>
  );
}
