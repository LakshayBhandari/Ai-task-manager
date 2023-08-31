"use client";
import fetchSuggestion from "@/lib/fetchSuggestion";
import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";

const Header = () => {

  const [board,searchString,setSearchString] = useBoardStore((state)=>[
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading,setLoading]=useState<boolean>(false);
  const [suggestion,setSuggestion]=useState<string>("");

  useEffect(()=>{
   if(board.columns.size === 0) return;

   setLoading(true);
   const fetchSuggestionFunc = async () =>{
    const suggestion = await fetchSuggestion(board);
    setSuggestion(suggestion);
    setLoading(false)
   }

   fetchSuggestionFunc();
  },[board])
  return (
    <header>
        
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className=" absolute top-0 left-0  w-full h-96 bg-gradient-to-br from-pink-400 to-[#0005d1] rounded-md filter blur-3xl opacity-50 -z-50"></div>
        <img
          src="https://media.giphy.com/media/hvD98gNZ7rGg34iYeY/giphy.gif"
          alt=""
          style={{width:"100px ",height:"100px"}}
          className=" md:w-56 pb-10 md-pb:0 object-contain"
        
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/*Search Box */}
          <form className="flex items-center space-x-5 bg-white  rounded-md  p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input value={searchString} onChange={(e) => setSearchString(e.target.value)} type="text" className="flex-1 outline-none p-2" />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/*Avatar */}
          <Avatar
            name="Lakshay Bhandari"
            style={{ fontSize: "30px" }}
            round
            size="50"
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5 ">
        <p className="flex items-center text-sm rounded-xl p-5 font-light pr-5 shadow-xl w-fit bg-white italic max-w-3xl text-[#0055d1]">
          <UserCircleIcon className={`inline-block w-10 h-10 text-[#0055d1] mr-1 ${loading && "animate-spin"}` }/>
          {suggestion && !loading ? suggestion : "GPT is summarising your tasks for the day"}
        </p>
      </div>
    </header>
  );
};

export default Header;
