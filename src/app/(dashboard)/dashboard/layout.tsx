import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import { Icons, Icon } from "@/components/Icons";
import MobileChatLayout from "@/components/MobileChatLayout";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import type { SidebarOption } from "@/types/typings";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metaData = {
  title: "Voxx | Dashboard",
  description: "Your dashboard",
};

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex bg-[#37393f] h-screen">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs bg-[#303136] rounded-tr-2xl rounded-br-2xl grow flex-col gap-y-5 overflow-y-auto  px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-blue-600 font-extrabold text-3xl" />
          <span className="pl-6 text-3xl font-bold text-blue-600">Voxx</span>
        </Link>
        {friends.length > 0 ? (
          <div className="text-lg font-semibold leading-6 text-zinc-400">
            Your Chats
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-lg font-semibold leading-6 mb-4 text-gray-400">
                Requests
              </div>
              <ul role="list" className="-m-x-2 mb-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-zinc-400 -mb-4 bg-transparent hover:text-zinc-300 hover:bg-[#37393f] group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-zinc-400 bg-transparent border-none group-hover:text-zinc-300 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium ">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li>
              <FriendRequestSidebarOptions
                sessionId={session.user.id}
                initialUnseenRequestCount={unseenRequestCount}
              />
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 overflow-x-auto scrolling-touch items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-zinc-400">
                <div className="relative h-8 w-8 bg-[#303136]">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your Profile Picture"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span className="text-zinc-300" aria-hidden="true">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full text-zinc-300 aspect-square" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  );
};

export default Layout;
