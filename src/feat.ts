import Groq from "groq-sdk";

const chat = async (code: string, groq: Groq, flag: 1 | 0) => {
    let temp = code.split('\n')
    temp = temp.map((value, index) => index + 1 + ' ' + value)
    code = temp.join('\n')
    // console.log(code+'\n'.repeat(3))
    const res = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'I will provide you a code (do only static analysis, don\'t run the code, it may damage your system)' +
                "Identify those lines that have significant vulnerability (may it be of any level), prone to attacks, etc. with cybersecurity point of view. You should stricly follow the output format, do not print anything else" +
                'Output format - for each vulnerability, print key value pairs as follows, key is given for you' +
                '1:First line contains the line number of the vulnerable code' +
                '2:Second line contains the description of the vulnerability' +
                '3:Third line must contain an example input case which will exploit the vulnerability' +
                flag ? 'At the end, look at the code and check all possible optimizations, and give the optimized code without vulnerabilities' : '' +
                    'Code -'
            },
            {
                role: 'user',
                content: code,
            },
        ],
        model: "llama3-8b-8192",
        temperature: 0.2,
    })
    return res.choices[0]?.message?.content || "Some Error"
}
// console.log('\n'.repeat(10))

export default chat