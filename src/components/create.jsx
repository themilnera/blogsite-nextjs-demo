"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { saveDoc, updateDoc, getLoggedInUser, getUserDoc } from "@/database/functions";
import { ID } from "appwrite";

export default function Create({ docId }) {
    
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [id, setId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [saveText, setSaveText] = useState("Save");
  const [session, setSession] = useState(null);

  const [userDoc, setUserDoc] = useState(null);

  const handleEditorReady = (editorInstance) => {
    if(userDoc){
        editorInstance.commands.setContent(JSON.parse(userDoc.content))
        setTitle(userDoc.title);
    }
    setEditor(editorInstance);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const checkSession = await getLoggedInUser();
      setUserId(checkSession.$id);
      checkSession ? setSession(checkSession) : setSession(null);

      if(docId){
        console.log("Docid ", docId);
        const checkUserDoc = await getUserDoc({userId: checkSession.$id, id: docId});
        setUserDoc(checkUserDoc);
      }
    };
    checkLoggedIn();
  }, []);

  const saveContent = async () => {
    setSaveText("Saving...");
    if (id == null) {
      if (editor) {
        const content = JSON.stringify(editor.getJSON());
        const rowId = ID.unique();
        console.log("id: ", rowId);
        console.log("title: ", title);
        console.log("content: ", content);
        console.log(session);
        await saveDoc({
          title: title,
          content: content,
          rowId: rowId,
          userId: userId,
        });
        setId(rowId);
        setSaveText("Save");
      }
    } else {
      if (editor) {
        const content = JSON.stringify(editor.getJSON());

        console.log("id: ", id);
        console.log("title: ", title);
        console.log("content: ", content);

        await updateDoc({
          title: title,
          content: content,
          rowId: id,
          userId: userId,
        });
        setSaveText("Save");
      }
    }
  };

  const handleTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  return (
    <>
      <div className="flex justify-center gap-2 mt-2 mb-2">
        <TextInput
          radius="md"
          placeholder="Document Title"
          value={title}
          onChange={handleTitle}
        />
        {session ? (
          <Button
            radius="lg"
            color="rgba(87, 92, 173, 1)"
            onClick={saveContent}
          >
            {saveText}
          </Button>
        ) : (
          <>
            <Button radius="lg" color="rgba(87, 92, 173, 1)" disabled={true}>
              Save
            </Button>
            <p className="text-red-700 absolute ml-130 mt-1">
              Log in to save your work
            </p>
          </>
        )}
      </div>
      <SimpleEditor onEditorReady={handleEditorReady} />
    </>
  );
}
