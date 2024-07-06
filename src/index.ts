import {Hono} from 'hono'
import execute from "./execute";
import chat from "./feat";
import {cors} from "hono/cors";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: Bun.env.GROQ_API_KEY });
const server = new Hono()
server
    .use(cors())
    .get('/',ctx=>ctx.text('Viler'))
    .post('/run', async (ctx) => {
        const clientRes = await ctx.req.json()
        const {code,lang} = clientRes;
        const arr:any = await execute(code,lang);
        let stdout,stderr;
        let errLine = -1 // stdout
        let answer = ''
        if (arr[0]>1){
            answer = await chat(code,groq,1)
            errLine = 0 // premium
            return ctx.json({errLine,answer})
        }
        else if (arr[0]>0){
          answer = await chat(code,groq,1);
          stdout = arr[1]
          return ctx.json({errLine,stdout,answer})
        }
        else{
          [stdout,errLine,stderr] = [...arr.slice(1)] // code error
            return ctx.json({stdout,errLine,stderr})
        }

    })
    .post('/ana',async ctx=>{
        const clientRes = await ctx.req.parseBody()
        const {level,paste,uploadContent} = clientRes
        const finalContent = uploadContent?uploadContent:paste;
        let res = '',flag:0|1 = ((level as string).startsWith('N'))?1:0
        res = await chat(finalContent as string,groq,flag) as string
        return ctx.text(res)
    })

export default server
/*
git init
git add .
git status
git commit -m "1st commit"
git branch -M main
git remote add origin https://github.com/chirag-g-shetty/test.git
git push -u origin main


* */
