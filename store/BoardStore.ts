import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/GetTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { Board, Column, Image, Todo, TypedColumn } from "@/typings";
import { ID, Permission, Role } from "appwrite";
import { write } from "fs";
import { todo } from "node:test";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard:()=>void;
    setBoardState:(board:Board) => void;
    updateTodoInDb:(todo:Todo,columnId:TypedColumn)=>void;
    newTaskInput: string;
    setNewTaskInput:(input:string) => void;

    newTaskType:TypedColumn;
    setNewTaskType:(columnId:TypedColumn)=>void;

    image:File|null;
    setImage:(image:File|null)=>void;

    searchString:string;
    setSearchString : (searchString:string) => void;

    addTask:(todo:string,columnId:TypedColumn,image?:File|null)=>void;
    deleteTask:(taskIndex:number,todoId:Todo,id:TypedColumn) => void;
}
export const useBoardStore=create<BoardState>((set,get)=>({
    board:{
        columns: new Map<TypedColumn,Column>()
    },

    searchString: "",
    newTaskInput:"",
    setSearchString:(searchString) =>set({searchString}),
    newTaskType:"todo",

   image:null,
   setImage:(image:File|null)=>set({image}),

    getBoard:async()=>{
      const board=await getTodosGroupedByColumn();
      set({board});
    },

    setBoardState:(board) => set({board}),
    
    setNewTaskInput:(input:string) => set({newTaskInput:input}),
    setNewTaskType:(columnId:TypedColumn)=>set({newTaskType:columnId}),

    updateTodoInDb : async (todo,columnId) => {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLLECTION_ID!,
        todo.$id,
        {
            title:todo.title,
            status:columnId,
        },
      )
    },
    deleteTask: async (taskIndex:number,todo:Todo,id:TypedColumn)=>{
     
      const newColumns = new Map(get().board.columns);

      //delete todoId from newColums

      newColumns.get(id)?.todos.splice(taskIndex,1)
      set({ board :{columns : newColumns}});

      if(todo.image){
        await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLLECTION_ID!,
        todo.$id
      )
    },

    addTask:async(todo:string,columnId:TypedColumn,image?:File|null)=>{
      let file: Image | undefined;

      if(image){
      const fileUploaded = await uploadImage(image);
      if(fileUploaded){
        file={
          bucketId:fileUploaded.bucketId,
          fileId:fileUploaded.$id,
        };
      }
      } 

       const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLLECTION_ID!,

        ID.unique(),
        {
          title:todo,
          status:columnId,
          //include image if it exists
          ...(file && {image:JSON.stringify(file)}),
        }
      );

      set({newTaskInput:""});

      set((state)=>{
        const newColumns = new Map(state.board.columns)

        const newtodo:Todo={
         $id,
         $createdAt:todo,
         title:todo,
         status:columnId,
         //include image if exists
         ...(file && { image :file}),
        };

        const column = newColumns.get(columnId)

        if(!column){
          newColumns.set(columnId,{
            id:columnId,
            todos:[newtodo]
          });
        }
        else{
            newColumns.get(columnId)?.todos.push(newtodo)
        }

        return{
          board:{
            columns:newColumns,
          }
        }
      })
        
    }
     

}))