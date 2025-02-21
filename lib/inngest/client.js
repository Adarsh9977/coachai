import { Inngest } from "inngest";

export const inngest= new Inngest({
    id: "coachai",
    name: "Coachai",
    credentials:{
        gemini:{
            apiKey: process.env.GEMINI_API_KEY,
        }
    }
})