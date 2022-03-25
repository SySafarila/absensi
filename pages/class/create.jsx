import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
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

  const onSubmit = async (data) => {
    if (!user) {
      return alert("Please login");
    }

    let dataX = {
      ...data,
      user_id: user?.uid,
      created_at: new Date().getTime(),
    };
    console.log(dataX);

    try {
      const classRef = await addDoc(collection(db, "classes"), dataX);

      const adminRef = await addDoc(collection(db, "classAdmins"), {
        user_id: user?.uid,
        class_id: classRef?.id
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="name"
          id="name"
          {...register("name", {
            required: true,
          })}
          placeholder="name"
        />
        <input
          type="text"
          name="university"
          id="university"
          {...register("university", {
            required: true,
          })}
          placeholder="university"
        />
        <input
          type="text"
          name="semester"
          id="semester"
          {...register("semester", {
            required: true,
          })}
          placeholder="semester"
        />
        <input
          type="text"
          name="lecturer"
          id="lecturer"
          {...register("lecturer", {
            required: true,
          })}
          placeholder="lecturer"
        />
        <input
          type="text"
          name="course"
          id="course"
          {...register("course", {
            required: true,
          })}
          placeholder="course"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateClass;
