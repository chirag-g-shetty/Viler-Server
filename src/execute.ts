const languageVersions= {
    'python': "3.10.0",
    'javascript': "18.15.0"
};

const execute = async (code: string, lang: 'python'|'javascript') => {
    const exeRes = await fetch(Bun.env.ENGINE as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: lang,
            version: languageVersions[lang],
            files: [
                {
                    content: code
                }
            ]
        })
    })

    interface RunResult {
        stdout: string;
        stderr: string;
    }

    interface ExecutionResponse {
        run: RunResult;
    }

    const res = (await exeRes.json()) as ExecutionResponse;
    const {stdout, stderr} = res.run;

    if (stderr) {
        if (stderr.includes("permission") || stderr.includes("module")) {
            // console.log("Premium error")
            return [2, '']
        } else {
            const arr = stderr.split('\n');
            let number;
            let message;
            let i = 0;
            let keyword = ''
            switch (lang) {
                case 'python':
                    keyword = 'line'
                    break
                case "javascript":
                    keyword = 'code'
                    break
            }
            for (; i < arr.length; i++) {
                if (arr[i].includes(keyword)) {
                    //index=i;
                    let temp = arr[i].split(' ');
                    switch (lang) {
                        case 'python':
                            number = Number(temp[temp.indexOf('line') + 1].replace(',', ''))
                            break
                        case "javascript":
                            number = Number(temp[temp.length - 1])
                            break
                    }
                    break
                }
            }
            for (; i < arr.length; i++) {
                if (arr[i].includes('Error')) {
                    message = arr[i];
                }
            }
            // console.log(number);
            // console.log(message);
            return [0, stdout, number, message];
        }
    } else {
        // console.log("No error");
        return [1, stdout];
    }
}

export default execute