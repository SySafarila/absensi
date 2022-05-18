import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import moment from "moment";

const CreatePresence = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const db = getFirestore();
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    console.count("<CreatePresence />");
  }, []);

  const onSubmit = async (data) => {
    let plusOneHour = moment().add(1, "hours").toISOString();
    try {
      const docRef = await addDoc(collection(db, "presences"), {
        ...data,
        class_uid: uid,
        created_at: new Date().getTime(),
        deadline_at: new Date(plusOneHour).getTime(),
      });
      reset({
        message: null,
      });
      console.log(`Presence stored with ID : ${docRef.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div style={{ marginBottom: "1rem" }}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 mb-5 text-gray-700">
        <label htmlFor="message" className="font-semibold">Send a presences with your messege below</label>
        <textarea
          name="message"
          id="message"
          placeholder="message"
          {...register("message", { required: true })}
          className="focus:outline-none focus:border-2 p-2 border w-full rounded-md max-h-[5rem] min-h-[4rem]"
        ></textarea>
        <button type="submit" className="border rounded-md px-5 py-1.5 bg-white hover:bg-gray-100 w-fit">Post</button>
      </form>
    // </div>
  );
};

export default CreatePresence;
