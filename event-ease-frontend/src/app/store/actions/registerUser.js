"use server";


export const registerUser = async (data) => {
  const res = await fetch(`http://localhost:5000/api/users/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const userInfo = await res.json();
  return userInfo;
};
