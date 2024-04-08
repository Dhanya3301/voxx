import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];
      const lastMessage = JSON.parse(lastMessageRaw) as Message;
      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <>
      <div className="container py-12">
        <h1 className="font-bold text-blue-500 text-5xl mb-8">Recent Chats</h1>
        {friendsWithLastMessage.length === 0 ? (
          <p className="text-md font-semibold text-zinc-400">
            Nothing to show here....
          </p>
        ) : (
          friendsWithLastMessage.map((friend) => (
            <div
              key={friend.id}
              className="relative bg-[#303136] p-3 rounded-md"
            >
              <div className="absolute right-4 inset-y-0 flex items-center">
                <ChevronRightIcon className="h-7 w-7 text-zinc-400" />
              </div>
              <Link
                href={`/dashboard/chat/${chatHrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
                className="relative sm:flex"
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                  <div className="relative h-6 w-6">
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      alt={`${friend.name} profile picture`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg text-zinc-300 font-semibold">
                    {friend.name}
                  </h4>
                  <p className="mt-1 max-w-md text-zinc-200">
                    <span className="text-zinc-400">
                      {friend.lastMessage.senderId === session.user.id
                        ? "You: "
                        : ""}
                    </span>
                    {friend.lastMessage.text}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default page;
