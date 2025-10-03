"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Anchor,
  Card,
  Center,
  NavLink,
  CloseButton,
} from "@mantine/core";
import {
  createUserAccount,
  loginUserAccount,
  getLoggedInUser,
  getUserDocs,
  deleteDoc
} from "@/database/functions";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { toggleList } from "@/components/tiptap-ui/list-button";

export default function user() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [docsLoaded, setDocsLoaded] = useState(false);

  const [login, setLogin] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [registerText, setRegisterText] = useState("Register");
  const [loginText, setLoginText] = useState("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  useEffect(() => {
    const checkLoggedIn = async () => {
      const checkSession = await getLoggedInUser();
      if (checkSession) {
        setUserId(checkSession.$id);
        setSession(checkSession);

        const checkUserDocs = await getUserDocs({ userId: checkSession.$id });
        if (checkUserDocs) {
          setUserDocs(checkUserDocs.rows);
          setDocsLoaded(true);
        } else {
          setDocsLoaded(false);
        }
      } else {
        setSession(null);
      }
    };
    checkLoggedIn();
  }, []);

  const toggleLogin = () => {
    setLogin(!login);
  };

  const toggleError = async () => {
    setError(true);
    await setTimeout(() => {
      setError(false);
    }, 2000);
  };

  const attemptLogin = async () => {
    if (email.trim() == "" || password.trim() == "") {
      setErrorMessage("Enter account details and log in");
      toggleError();
      return;
    }
    try {
      await loginUserAccount({ email: email, password: password });
      router.push("/");
    } catch (e) {
      setErrorMessage(e);
      toggleError();
    }
  };

  const attemptRegister = async () => {
    if (
      email.trim() == "" ||
      password.trim() == "" ||
      verifyPassword.trim() == ""
    ) {
      setErrorMessage("Enter details to register your account");
      toggleError();
      return;
    } else if (password != verifyPassword) {
      setErrorMessage("Your passwords must match");
      return;
    }
    try {
      setRegisterText("Registering...");
      await createUserAccount({
        userId: ID.unique(),
        email: email,
        password: password,
      });
      router.push("/");
    } catch (e) {
      setErrorMessage(e);
      toggleError();
    }
  };

  const attemptDelete = async (docId) =>{
    try {
        deleteDoc({ rowId: docId }).then((result)=>{
            const newUserDocs = userDocs.filter((doc)=> doc.$id != docId);
            setUserDocs(newUserDocs);
        });
    } catch (error) {
        console.log("Failure to delete document, error: ", error);
    }
  }

  const handleEmail = (event) => {
    setEmail(event.currentTarget.value);
  };
  const handlePassword = (event) => {
    setPassword(event.currentTarget.value);
  };
  const handleVerifyPassword = (event) => {
    setVerifyPassword(event.currentTarget.value);
  };

  return (
    <>
      {!session ? (
        login ? (
          <div className="w-full h-200 flex justify-center items-center">
            <div className="w-50 flex flex-col justify-center items-center gap-4">
              <TextInput
                placeholder="Email"
                value={email}
                onChange={handleEmail}
              />
              <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePassword}
              />
              <Button radius="lg" onClick={attemptLogin}>
                {loginText}
              </Button>

              <Anchor onClick={toggleLogin}>Register Account</Anchor>
            </div>
          </div>
        ) : (
          <div className="w-full h-200 flex justify-center items-center">
            <div className="w-50 flex flex-col justify-center items-center gap-4">
              <TextInput
                placeholder="Email"
                value={email}
                onChange={handleEmail}
              />
              <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePassword}
              />
              <TextInput
                placeholder="Repeat Password"
                type="password"
                value={verifyPassword}
                onChange={handleVerifyPassword}
              />
              <Button radius="lg" onClick={attemptRegister}>
                {registerText}
              </Button>

              <Anchor onClick={toggleLogin}>Login</Anchor>
            </div>
          </div>
        )
      ) : (
        <>
          {/* if logged in */}
          <h1 className="text-center mt-30 underline text-2xl">My Documents</h1>
          <div className="flex flex-wrap ml-100 mr-100 mt-10">
            {userDocs.length > 0 ? (
              userDocs.map((doc) => {
                return (
                  <Card key={doc.$id} w={200} className="ml-3 mt-5 mr-3">
                    <span className="flex">
                      <NavLink
                        href={`/create/${doc.$id}`}
                        label={doc.title}
                      ></NavLink>
                      <CloseButton className="mt-2" onClick={()=>{attemptDelete(doc.$id)}}/>
                    </span>
                  </Card>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="border-solid bg-red-600 text-center p-5">
          {errorMessage}
        </div>
      )}
    </>
  );
}
