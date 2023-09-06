import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
    if(!file) return;

    const fileUploaded = await storage.createFile(
        "64eba7acdea34625ec97",
        ID.unique(),
        file
    )

    console.log(fileUploaded)

    return fileUploaded
}

export default uploadImage;