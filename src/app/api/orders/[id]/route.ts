import { NextResponse } from "next/server";
import prisma from "@/utils/connect";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await req.json();

  try {
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: { status: body },
    });
    return new NextResponse(JSON.stringify(order), { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "cannot update order status" }),
      { status: 500 }
    );
  }
};
