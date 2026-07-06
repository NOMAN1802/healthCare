// "use server";

import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";

export const userLogin = async (data: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
      // cache: "no-store",
    },
  );
  const userInfo = await res.json();

  if (userInfo?.data?.accessToken) {
    const passwordChangeRequired = userInfo.data.needsPasswordChange;

    setAccessToken(userInfo.data.accessToken, {
      redirect: "/dashboard",
      passwordChangeRequired,
    });
  }

  return userInfo;
};
