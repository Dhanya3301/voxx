import AddFriendButton from "@/components/AddFriendButton";
import { FC } from "react";

const page: FC = ({}) => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-blue-600 text-5xl mb-8 ml-4">
        Add a Friend
      </h1>
      <AddFriendButton />
    </main>
  );
};

export default page;
