import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/connect";

export const GET = async (req: NextRequest) => {
  // console.log("REQ URL " + req.url);
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  // console.log("CATEGORY " + cat);
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(cat ? { catSlug: cat } : { isFeatured: true }),
      },
    });
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }),
      { status: 500 }
    );
  }
};
