"use client";
import { Badge, NavLink } from "@mantine/core";
import { account } from "../app/appwrite";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [userEmail, setUserEmail] = useState("User");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.get();
        setUserEmail(session.email);
      } catch (err) {
        console.log("No user logged in", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="mt-5 flex w-65 gap-10">
      <NavLink href="/" label="Home" />
      <NavLink href="/create" label="Create" />
      <NavLink href="/user" label={userEmail} className="self-end"/>
    </div>
  );
}
