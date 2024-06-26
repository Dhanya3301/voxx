"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validation/add-friend";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof axios.AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Something Went Wrong" });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm m-4">
      <label
        htmlFor="email"
        className=" block text-sm font-medium leading-6 text-zinc-400"
      >
        Add by Email
      </label>
      <div className="flex gap-4 mt-2">
        <input
          {...register("email")}
          type="text"
          className=" px-2 block w-full bg-transparent border-b-2 border-zinc-400 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400/40 focus:outline-none sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend Request Sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
