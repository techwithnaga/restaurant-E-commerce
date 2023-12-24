import { NextResponse } from "next/server";
import prisma from "@/utils/connect";
import { NextRequest } from "next/server";

//get a single product
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "cannot get a product" }),
      { status: 500 }
    );
  }
};
