const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  const { orderId } = params;

  console.log("ORDER ID : " + orderId);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  console.log("ORDER : " + order);

  if (order) {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100 * 100,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log("client secret : " + paymentIntent);

    //update intentId
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: { intent_id: paymentIntent.id },
    });

    return new NextResponse(
      JSON.stringify({ clientSecret: paymentIntent.client_secret })
    );
  } else {
    return new NextResponse(JSON.stringify({ message: "Order not found!" }), {
      status: 404,
    });
  }
};
