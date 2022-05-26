import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { UserState, UserDetail as UserDetailState } from "../RecoilState";
import { useForm } from "react-hook-form";
import LoadingScreen from "../LoadingScreen";
import Link from "next/link";

const UserDetail = (props) => {
  const db = getFirestore();
  const user = useRecoilValue(UserState);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [userDetail, setUserDetail] = useRecoilState(UserDetailState);
  const [type, setType] = useState(null);

  useEffect(() => {
    getX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getX = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log(docSnap.data());
      setUserDetail(docSnap.data());
    } else {
      // console.log("No such document!");
      setUserDetail(false);
    }
  };

  const onSubmit = async (data) => {
    // console.log({ ...data, type: type });
    try {
      await setDoc(doc(db, "users", user.uid), { ...data, type: type });
      setUserDetail(data);
    } catch (err) {
      // setUserDetail(false);
    }
  };

  const Forms = () => {
    if (type == "mahasiswa") {
      return <MahasiswaForm />;
    } else if (type == "dosen") {
      return <DosenForm />;
    } else {
      return null;
    }
  };

  const MahasiswaForm = () => {
    return (
      <div className="flex flex-col items-center gap-2 mt-3">
        <div>
          {/* <label htmlFor="name">name</label> */}
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", { required: true })}
            className="w-[15rem] py-2 px-3 border rounded-md"
            placeholder="Name"
          />
        </div>
        <div>
          {/* <label htmlFor="nim">nim</label> */}
          <input
            type="text"
            name="nim"
            id="nim"
            {...register("nim", { required: true })}
            className="w-[15rem] py-2 px-3 border rounded-md"
            placeholder="NIM"
          />
        </div>
      </div>
    );
  };

  const DosenForm = () => {
    return (
      <div className="flex flex-col items-center gap-2 mt-3">
        <div>
          {/* <label htmlFor="name">name</label> */}
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", { required: true })}
            className="w-[15rem] py-2 px-3 border rounded-md"
            placeholder="Name"
          />
        </div>
        <div>
          {/* <label htmlFor="identifier">identifier</label> */}
          <input
            type="text"
            name="identifier"
            id="identifier"
            {...register("identifier", { required: true })}
            className="w-[15rem] py-2 px-3 border rounded-md"
            placeholder="Identifier"
          />
        </div>
      </div>
    );
  };

  if (userDetail == null) {
    return <LoadingScreen />;
  } else if (userDetail == false) {
    return (
      <>
        <div className="bg-gray-100 min-h-screen py-5">
          <div className="max-w-screen-sm mx-auto bg-white min-h-[calc(100vh-2.5rem)] p-10 rounded-xl overflow-clip">
            <nav className="flex justify-center items-center border-b-2 py-4 -mx-10 -mt-10">
              <Link href="/">
                <a>Logo</a>
              </Link>
            </nav>
            <div className="py-5 flex flex-col gap-3">
              <p>User detail required</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    id="type"
                    value={"mahasiswa"}
                    onClick={() => setType("mahasiswa")}
                  />
                  <label htmlFor="type" onClick={() => setType("mahasiswa")}>
                    mahasiswa
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    id="type2"
                    value={"mahasiswa"}
                    onClick={() => setType("dosen")}
                  />
                  <label htmlFor="type2" onClick={() => setType("dosen")}>
                    dosen
                  </label>
                </div>
                <Forms />
                {type != null ? (
                  <div className="flex justify-center mt-3">
                    <button
                      type="submit"
                      className="bg-white w-[15rem] border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold"
                    >
                      submit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return props.children;
  }
};

export default UserDetail;
