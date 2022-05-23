import { useRecoilState } from "recoil";
import AuthController from "../components/AuthController";
import { UserState } from "../components/RecoilState";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import LoadingRequired from "../components/LoginRequired";

export default function Home() {
  const [user, setUser] = useRecoilState(UserState);

  const Auth = AuthController();
  const db = getFirestore();

  const addData = async () => {
    const docRef = await addDoc(collection(db, "cities"), {
      name: "Tokyo",
      country: "Japan",
    });

    console.log(`Document written with ID : ${docRef.id}`);
  };

  const Classes = () => {
    if (user) {
      return (
        <>
          <Link href="/classes/create">Buat Kelas</Link>
          <span> | </span>
          <Link href="/classes">Kelas</Link>
        </>
      );
    } else {
      return null;
    }
  };

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
