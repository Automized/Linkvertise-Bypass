const axios = require("axios");
const moment = require("moment");
require("moment-duration-format");
const r = require("readline-sync");
const chalk = require("chalk");
const open = require('open');
const setTitle = require("console-title");

setTitle('Linkvertise Bypasser (After fix) | @Automized on github')

Load_Start()
function Load_Start() {
    console.clear()

    const lvlinks = [
        "https://direct-link.net", 
        "https://link-hub.net", 
        "https://link-target.net",
        "https://link-center.net",
        "https://linkvertise.com"
    ]

    const str = chalk.whiteBright(`
                    ██╗    ██╗   ██╗    ██████╗ ██╗   ██╗██████╗  █████╗ ███████╗███████╗
                    ██║    ██║   ██║    ██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝
                    ██║    ██║   ██║    ██████╔╝ ╚████╔╝ ██████╔╝███████║███████╗███████╗
                    ██║    ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝  ██╔═══╝ ██╔══██║╚════██║╚════██║
                    ███████╗╚████╔╝     ██████╔╝   ██║   ██║     ██║  ██║███████║███████║
                    ╚══════╝ ╚═══╝      ╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝
                           Example: https://linkvertise.com/{user_id}/{link_name}\n`)

    const newstr = str
    .replace(new RegExp('╗', 'g'), chalk.cyanBright('╗'))
    .replace(new RegExp('║', 'g'), chalk.cyanBright('║'))
    .replace(new RegExp('╚', 'g'), chalk.cyanBright('╚'))
    .replace(new RegExp('═', 'g'), chalk.cyanBright('═'))
    .replace(new RegExp('╝', 'g'), chalk.cyanBright('╝'))
    .replace(new RegExp('╔', 'g'), chalk.cyanBright('╔'))
    .replace(new RegExp('{link_name}', 'g'), chalk.cyanBright('{link_name}'))
    .replace(new RegExp('{user_id}', 'g'), chalk.cyanBright('{user_id}'))

    console.log(newstr)
    const link = r.question(' '.repeat(20) + chalk.whiteBright('[') + chalk.cyanBright('>') + chalk.whiteBright(']') + chalk.cyanBright(':') + chalk.whiteBright(' Link: '))

    if(!link) return Load_Start()

    const linktest = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(link)
    
    let allow;

    for(const url of lvlinks){
        if(link.toLowerCase().startsWith(url)){
            allow = true
            break;
        }else if(link.toLowerCase().startsWith(url.split('https://'))){
            allow = true
            break;
        }else if(link.toLowerCase().startsWith(url.replace('https', 'http'))){
            allow = true
            break;
        }
    }

    if(linktest && allow) {
        Bypass(link)
    }else{
        console.log(' '.repeat(20) + chalk.whiteBright('[') + chalk.cyanBright('X') + chalk.whiteBright(']') + chalk.cyanBright(':') + chalk.whiteBright(` Invalid Url`))
        return setTimeout(() => { Load_Start() }, 2000);
    }
}

async function Bypass(link) {
    const url = new URL(link)

    const path = `${url.pathname.replace('/download','').split('/')[1]}/${url.pathname.replace('/download','').split('/')[2]}`
    const start = Date.now();

    const info = await axios({
        method: "GET",
        url: `https://publisher.linkvertise.com/api/v1/redirect/link/static/${path}?origin=&resolution=1920x1080`,
        headers: {
            'user-agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        }
    }).catch((err) => {
        console.log(err)
    })

    const link_id = info.data.data.link.id
    let type = info.data.data.link.target_type.toLowerCase()
    if(type == "url") {
        type = "target"
    }

    const UT = info.data.user_token

    const token_request = await axios({
        method: "GET",
        url: "https://paper.ostrichesica.com/ct?id=14473",
        headers: {
            referer : "https://linkvertise.com/"
        }
    }).catch((err) => {
        return console.log(err)
    })

    const token_data = token_request.data
    const cq_token = token_data.substring(token_data.search("\"jsonp") + 9,token_data.search("req") - 3)

    const validation = await axios({
        method: "POST",
        url: `https://publisher.linkvertise.com/api/v1/redirect/link/${path}/traffic-validation?X-Linkvertise-UT=${UT}`,
        headers: {
            host: 'publisher.linkvertise.com',
            connection: 'keep-alive',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            accept: 'application/json',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            origin: 'https://linkvertise.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'https://linkvertise.com/',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
        },
        data: {
            "type": "cq",
            "token": cq_token //if this breaks then contact me :)
        }
    }).catch((err) => {
        return console.log(err)
    })

    const tokenn = validation.data.data.tokens.TARGET
    if(!tokenn) {
        console.log(info.data)
        return console.log("Something went wrong with the captcha token")
    }

    const obj = {
        "timestamp": new Date().getTime(),
        "random": "6548307",
        "link_id": link_id
    }

    const ResultRequest = await axios({
        method: "POST",
        url: `https://publisher.linkvertise.com/api/v1/redirect/link/${path}/${type}?X-Linkvertise-UT=${UT}`,
        headers: {
            host: 'publisher.linkvertise.com',
            connection: 'keep-alive',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            accept: 'application/json',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            origin: 'https://linkvertise.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'https://linkvertise.com/',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
        },
        data: {
            serial: Buffer.from(JSON.stringify(obj)).toString('base64'),
            token: tokenn
        }
    }).catch((err) => {
        return console.log(err)
    })

    const end = Date.now()
    const time = moment.duration(end - start).get("milliseconds") + 'ms'

    const target = ResultRequest.data.data[type]

    console.log()
    console.log(' '.repeat(20) + chalk.whiteBright('[') + chalk.cyanBright('+') + chalk.whiteBright(']') + chalk.cyanBright(':') + chalk.whiteBright(` Destination: ${target}`))
    console.log(' '.repeat(20) + chalk.whiteBright('[') + chalk.cyanBright('+') + chalk.whiteBright(']') + chalk.cyanBright(':') + chalk.whiteBright(` Time Elapsed: ${time}`))
    console.log()
    
    if(target == undefined){
        console.log(ResultRequest.data)
    }

    const x = r.question(' '.repeat(20) + chalk.whiteBright('[') + chalk.cyanBright('>') + chalk.whiteBright(']') + chalk.cyanBright(':') + chalk.whiteBright(` Click enter if you want open it (otherwise type "n" to return to main menu) `))
    if(x.toLowerCase() == "n" || x.toLowerCase() == "no"){
        return Load_Start()
    }

    await open(target).catch(() => null)

    return Load_Start()
}
