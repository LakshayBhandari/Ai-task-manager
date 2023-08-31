import openai from "@/openai";
import { NextResponse } from "next/server";
 
export async function POST(request:Request){
    // todos in the body of post request

    const {todos} = await request.json();
    console.log(todos);

    // communicate with open-AI GPT-3

    const response= await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n:1,
        stream:false,
        messages:[
            {
                role:"system",
                content:`When responding always respond to user as Lakshay and say welcome to the bhandari clan`
            },
            {
                role:"user",
                content:`Hi there , provide a summary of the follwoing todos. Count how many todos are in each one category such as To do , in progress and done, then tell the user to have a productive key! Here's the data: ${JSON.stringify(todos)}`
            }
        ]
    })

    
    console.log(response.choices[0].message);

    return NextResponse.json(response.choices[0].message);
}
