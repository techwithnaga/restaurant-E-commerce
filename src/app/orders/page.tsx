"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderType } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: String; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading || status === "loading") return "Loading...";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, id: String) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLFormElement;
    const status = input.value;
    console.log(id);
    mutation.mutate({ id, status });
    toast.success("Order status has been changed!");
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr
              className={`text-sm md:text-base ${
                item.status !== "delivered" && "bg-red-50"
              }`}
            >
              <td className="hidden md:block py-6 px-1">{item.id}</td>
              <td className="py-6 px-1">{item.createdAt.slice(0, 10)}</td>
              <td className="py-6 px-1">{item.price}</td>
              <td className="hidden md:block py-6 px-1">
                {item.products[0].title}
              </td>

              {session?.user.isAdmin ? (
                <td>
                  <form
                    className="flex justify-center align-center gap-2"
                    onSubmit={(e) => handleSubmit(e, item.id)}
                  >
                    <input
                      placeholder={item.status}
                      className="ring-1 ring-red-100 p-2 rounded-md"
                    ></input>
                    <button className="bg-red-400 p-2 rounded-full">
                      <Image
                        src="/edit.png"
                        alt=""
                        width={20}
                        height={20}
                      ></Image>
                    </button>
                  </form>
                </td>
              ) : (
                <td className="py-6 px-1">{item.status}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
