"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const UserLinks = () => {
  const { data, status } = useSession();

  return (
    <div>
      {status !== "authenticated" ? (
        <Link href="/login">Login</Link>
      ) : (
        <div className="flex gap-3">
          <Link href="/orders">Orders</Link>
          <span onClick={() => signOut()} className="cursor-pointer">
            Logout
          </span>
        </div>
      )}
    </div>
  );
};

export default UserLinks;
