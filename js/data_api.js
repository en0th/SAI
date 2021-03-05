const preDom = document.querySelector('#mask_content');

async function switchOrigin(index, page){
    let fun = '';
    switch (parseInt(index)) {
        case 0: fun = 'getXZaliyunData'; break;
        case 1: fun = 'getAnQuanKeData'; break;
        case 2: fun = 'getFreeBufData'; break;
        case 3: fun = 'getFreeBufKXData'; break;
        case 4: fun = 'getSeeBugData'; break;
        case 5: fun = 'getHacking8Data'; break;
        default: fun = 'getXZaliyunData'; break;
    }
    return await window[fun](page);
}

function makeList(info){
    let o = new getListTemple();
    o['info']['origin'] = info[0];
    o['info']['logo'] = info[1];
    return o;
}

function genareteMData(){
    let o = {
        "url": arguments[0],
        "title": arguments[1],
        "author": arguments[2],
        "summary": arguments.length >= 4 ? arguments[3] : ''
    }
    return o;
}

// 安全客数据接口
async function getAnQuanKeData(page){
    page = page ? page : 1;
    let olist = makeList([
        '安全客',
        'https://www.anquanke.com/img/job/logo.svg'
    ]);
    try{
        await fetch(`https://api.anquanke.com/data/v1/posts?page=${page}&size=20`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                "Accept": "application/json; charset=utf-8"
            }),
        })
        .then(async res => {
            let originPath = 'https://www.anquanke.com/post/id/';
            const {data} = await res.json();
            let dataList = [];
            if (data){
                for(let item of data){
                    let i = genareteMData(originPath+item.id, item.title, item.author.nickname);
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        })
    } catch (e){};
    if(olist.data.length)console.log('aqk ok');
    return olist;
}

// 先知社区
async function getXZaliyunData(page){
    page = page ? page : 1;
    let olist = makeList([
        '先知社区',
        'https://xz.aliyun.com/forum/static/icon/xianzhi-brand.svg'
    ]);
    try{
        await fetch(`https://xz.aliyun.com/?page=${page}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "text/html;charset=utf-8",
            })
        }).then(async res => {
            let originPath = 'https://xz.aliyun.com';
            let html = await res.text();
            preDom.innerHTML = splitHtml(html, '<div id="includeList">', '<div class="pagination clearfix">');
            const tdDom = preDom.querySelectorAll('td');
            let dataList = [];
            if (tdDom){
                for(let item of tdDom){
                    let titleDom = item.querySelector('.topic-title');
                    let url = titleDom.href;
                    url = originPath + (url.substring(url.indexOf('/t/'), url.length));
                    let i = genareteMData(url, titleDom.innerHTML.trim(),
                    item.querySelector('.topic-info a:nth-of-type(1)').innerHTML);
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        });
    } catch (e){};
    if(olist.data.length)console.log('xz ok');
    return olist;
}

async function getFreeBufData(page){
    page = page ? page : 1;
    let olist = makeList([
        'freebuf',
        'https://www.freebuf.com/images/logoMax.png'
    ]);
    try{
        await fetch(`https://www.freebuf.com/fapi/frontend/home/article?page=${page}&limit=20&type=1&day=7&category=%E7%B2%BE%E9%80%89`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                "Accept": "application/json; charset=utf-8"
            }),
        })
        .then(async res => {
            let originPath = 'https://www.freebuf.com/articles/web/';
            const {data: {list}} = await res.json();
            let dataList = [];
            if (list){
                for(let item of list){
                    let i = genareteMData(originPath + item['ID'] + '.html', item['post_title'], item['username']);
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        })
    } catch (e){};
    if(olist.data.length)console.log('freebuf ok');
    return olist;
}

async function getFreeBufKXData(page){
    page = page ? page : 1;
    let olist = makeList([
        'freebuf快讯',
        'https://www.freebuf.com/images/logoMax.png'
    ]);
    try{
        await fetch(`https://www.freebuf.com/fapi/frontend/home/clipped?page=${page}&limit=20`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                "Accept": "application/json; charset=utf-8"
            }),
        })
        .then(async res => {
            let originPath = 'https://www.freebuf.com/articles/web/';
            const {data} = await res.json();
            let dataList = [];
            if (data){
                for(let item of data){
                    let i = genareteMData(item.bug_url, item.bug_title, item.bug_from);
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        })
    } catch (e){};
    if(olist.data.length)console.log('freebuf快讯 ok');
    return olist;
}

async function getSeeBugData(page){
    page = page ? page : 1;
    let olist = makeList([
        'seebug',
        'https://www.seebug.org/static/dist2/images/seebug-logo2.png?v=2'
    ]);
    try{
        await fetch(`https://paper.seebug.org/?page=${page}`)
        .then(async res => {
            let originPath = 'https://paper.seebug.org';
            let html = await res.text();
            preDom.innerHTML = splitHtml(html, '<main>', '</main>');
            let arDom = preDom.querySelectorAll('article');
            let dataList = [];
            if(arDom.length){
                for(let item of arDom){
                    let aDom = item.querySelector('header > h5 > a');
                    let url = aDom.href
                    url = originPath + url.substr(url.search(/\/\d+\//), url.length);
                    let author = item.querySelectorAll('section')[1].innerHTML.toString();
                    author = author.trim().split('\n')[0].replace('作者：', '');
                    let i = genareteMData(url, aDom.innerHTML, author);
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        })
    } catch (e){};
    if(olist.data.length)console.log('seebug ok');
    return olist;
}

async function getHacking8Data(page){
    page = page ? page : 1;
    let olist = makeList([
        'hacking8',
        'https://i.hacking8.com/static/logo.png'
    ]);
    try{
        await fetch(`https://i.hacking8.com/?page=${page}`)
        .then(async res => {
            let html = await res.text();
            html = '<table class="table">' + splitHtml(html, '<table class="table">', '</table>') + '</table>';
            html = html.replace(/<img alt="..." class="media-object" src=".*?">/g, ""); // 删除图片加载
            preDom.innerHTML = html;
            let trDom = preDom.querySelectorAll('tbody > tr');
            let dataList = [];
            if(trDom.length){
                for(let item of trDom){
                    const aDom = item.querySelector('td:nth-child(3) > div > div.link > a');
                    const author = item.querySelector('td:nth-child(2) > a > span');
                    const summary = item.querySelector('td:nth-child(3) > div > div.media-body > pre');
                    let i = genareteMData(aDom.href, aDom.innerHTML, author.innerHTML, summary ? summary.innerHTML : '');
                    dataList.push(i);
                }
            }
            olist.data = dataList;
        })
    } catch (e){};
    if(olist.data.length)console.log('hacking8 ok');
    return olist;
}
