"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/create-intent/${id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };
  console.log("Client Secret : " + clientSecret);
  return (
    <div>
      {/* <p>Payment Info</p> */}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default page;
