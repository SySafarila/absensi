import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import LoginRequired from "../../components/LoginRequired";
import { UserState } from "../../components/RecoilState";

const CreateClass = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const user = useRecoilValue(UserState);
  const db = getFirestore();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (!user) {
      return alert("Please login");
    }

    let dataX = {
      ...data,
      user_id: user?.uid,
      created_at: new Date().getTime(),
    };

    try {
      const classRef = await addDoc(collection(db, "classes"), dataX);
      const adminRef = await addDoc(collection(db, "classAdmins"), {
        user_id: user?.uid,
        class_id: classRef?.id,
      });
      const userClassesRef = await addDoc(collection(db, "userClasses"), {
        user_id: user?.uid,
        class_id: classRef?.id,
      });

      router.push(`/classes/${classRef.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <LoginRequired>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center h-screen items-center bg-gray-100 flex-col gap-2"
        >
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", {
              required: true,
            })}
            placeholder="Name"
            className="w-[15rem] py-2 px-3 border rounded-md"
          />
          <input
            type="text"
            name="university"
            id="university"
            {...register("university", {
              required: true,
            })}
            placeholder="University"
            className="w-[15rem] py-2 px-3 border rounded-md"
          />
          <input
            type="text"
            name="semester"
            id="semester"
            {...register("semester", {
              required: true,
            })}
            placeholder="Semester"
            className="w-[15rem] py-2 px-3 border rounded-md"
          />
          <input
            type="text"
            name="lecturer"
            id="lecturer"
            {...register("lecturer", {
              required: true,
            })}
            placeholder="Lecturer"
            className="w-[15rem] py-2 px-3 border rounded-md"
          />
          <input
            type="text"
            name="course"
            id="course"
            {...register("course", {
              required: true,
            })}
            placeholder="Course"
            className="w-[15rem] py-2 px-3 border rounded-md"
          />
          <button
            type="submit"
            className="bg-white w-[15rem] border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold"
          >
            Submit
          </button>
        </form>
      </LoginRequired>
    </>
  );
};

export default CreateClass;
