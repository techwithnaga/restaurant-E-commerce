import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/connect";
import { getAuthSession } from "@/utils/auth";

//fetch all orders
export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (session) {
    try {
      if (session.user.isAdmin) {
        const orders = await prisma.order.findMany();

        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }
      const orders = await prisma.order.findMany({
        where: {
          userEmail: session.user.email!,
        },
      });

      return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ message: "Cannot get orders!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "you are not authenticated!" }),
      { status: 401 }
    );
  }
};
