import { databaseId, tableId, tablesDB, account } from "@/app/appwrite";
import { Query } from "appwrite";
export const saveDoc = async ({ title, content, rowId, userId }) => {
  try {
    await tablesDB.createRow({
      databaseId: databaseId,
      tableId: tableId,
      rowId: rowId,
      data: {
        title: title,
        content: content,
        userId: userId,
      },
    });
  } catch (error) {
    console.log("Failed to save to DB, error: " + error);
  }
};

export const deleteDoc = async({ rowId }) =>{
    try {
        await tablesDB.deleteRow({ databaseId: databaseId, tableId: tableId, rowId: rowId });
    } catch (error) {
        console.log("Failed to delete DB entry, error: ", error);
    }
}

export const updateDoc = async ({ title, content, rowId, userId }) => {
  try {
    await tablesDB.updateRow({
      databaseId: databaseId,
      tableId: tableId,
      rowId: rowId,
      data: {
        title: title,
        content: content,
        userId: userId,
      },
    });
  } catch (error) {
    console.log("Failed to update DB entry, error: " + error);
  }
};

export const getUserDocs = async ({ userId }) => {
  try {
    const userRows = await tablesDB.listRows({
      databaseId: databaseId,
      tableId: tableId,
      queries: [Query.equal("userId", userId)],
    });
    return userRows;
  } catch (error) {
    console.log("Failed to fetch user's documents" + error);
  }
};

export const getUserDoc = async ({ userId, id }) => {
  try {
    console.log("FUNCTIONS: userId", userId);
    console.log("FUNCTIONS: id", id);
    const userRows = await tablesDB.listRows({
      databaseId: databaseId,
      tableId: tableId,
      queries: [Query.equal("$id", id)],
    });
    console.log(userRows);
    if(userRows){
        if(userRows.rows[0].userId == userId){
            return userRows.rows[0];
        }
        else{
            return null;
        }
    }
  } catch (error) {
    console.log("Failed to fetch user doc: ", error);
  }
};

export const createUserAccount = async ({ userId, email, password, name }) => {
  try {
    await account.create({
      userId: userId,
      email: email,
      password: password,
      name: name,
    });
    await account.createEmailPasswordSession({
      email: email,
      password: password,
    });
  } catch (error) {
    console.log("Failed to create user account, error: ", error);
  }
};

export const loginUserAccount = async ({ email, password }) => {
  try {
    await account.createEmailPasswordSession({
      email: email,
      password: password,
    });
  } catch (error) {
    console.log("Failed to login user account, error: ", error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const session = await account.get();
    return session;
  } catch (err) {
    console.log("No user logged in", err);
    return null;
  }
};

// export const updateUserAccount = async({userId, email, password, name})=>{
//     try{
//         await account.({
//             userId: userId,
//             email: email,
//             password: password,
//             name: name
//         });
//     }
//     catch(error){
//         console.log("Failed to create user account, error: ", error);
//     }
// }
