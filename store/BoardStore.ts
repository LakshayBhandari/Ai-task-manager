import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/GetTodosGroupedByColumn";
import { Board, Column, Todo, TypedColumn } from "@/typings";
import { Permission, Role } from "appwrite";
import { write } from "fs";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard:()=>void;
    setBoardState:(board:Board) => void;
    updateTodoInDb:(todo:Todo,columnId:TypedColumn)=>void;

    searchString:string;
    setSearchString : (searchString:string) => void;

    deleteTask:(taskIndex:number,todoId:Todo,id:TypedColumn) => void;
}
export const useBoardStore=create<BoardState>((set,get)=>({
    board:{
        columns: new Map<TypedColumn,Column>()
    },

    searchString: "",
    setSearchString:(searchString) =>set({searchString}),

    getBoard:async()=>{
      const board=await getTodosGroupedByColumn();
      set({board});
    },
    setBoardState:(board) => set({board}),

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
    }
}))