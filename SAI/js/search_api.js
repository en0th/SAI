const preDom = document.querySelector('#mask_content');
const cbiDom = document.querySelector('#content_by_iframe');

function generateData(){
    let o = {
        "url": arguments[0],
        "title": arguments[1],
        "origin": arguments[2],
        "date": arguments[3],
        "detail": arguments.length >= 4 ? arguments[4] : '',
    }
    return o;
}

async function switchSApi(v, i, p){
    p = p ? parseInt(p) : 1;
    let fun = '';
    switch (i) {
        case 1: fun = 'maxSP';break;
        case 2: fun = 'maxWZ';break;
        case 3: fun = 'searchXZ';break;
        case 4: fun = 'searchAnQuanKe';break;
        case 5: fun = 'searchWYarticle';break;
        case 6: fun = 'maxLD';break;
        case 7: fun = 'searchWY';break;
        case 8: fun = 'searchSeeBug';break;
        case 9: fun = 'searchAnQuanKeCVE';break;
        case 10: fun = 'searchSaucsCVE';break;
        default:fun = 'maxSP';break;
    }
    return await window[fun](v, p);
}

async function maxSP(key, page){
    let ALL_LIST = [];
    const list = await Promise.all([
        searchXZ(key, page),
        searchAnQuanKe(key, page),
        searchWY(key, page),
        searchWYarticle(page, page),
        searchSeeBug(key, page),
        searchAnQuanKeCVE(key, page),
        searchSaucsCVE(key, page),
    ]);
    for (let i of list){
        ALL_LIST = ALL_LIST.concat(i);
    }
    ALL_LIST = orderByDateNew(ALL_LIST);
    return ALL_LIST;
}
async function maxWZ(key, page){
    let ALL_LIST = [];
    const list = await Promise.all([
        searchXZ(key, page),
        searchAnQuanKe(key, page),
        searchWYarticle(page, page),
    ]);
    for (let i of list){
        ALL_LIST = ALL_LIST.concat(i);
    }
    ALL_LIST = orderByDateNew(ALL_LIST);
    return ALL_LIST;
}
async function maxLD(key, page){
    let ALL_LIST = [];
    const list = await Promise.all([
        searchWY(key, page),
        searchSeeBug(key, page),
        searchAnQuanKeCVE(key, page),
        searchSaucsCVE(key, page),
    ]);
    for (let i of list){
        ALL_LIST = ALL_LIST.concat(i);
    }
    ALL_LIST = orderByDateNew(ALL_LIST);
    return ALL_LIST;
}

// 排序
function orderByDateNew(data_list){
    let list = data_list;
    for (let i=0;i < list.length -1;i++){
        for (let j=0;j < list.length - 1 - i;j++){
            if (new Date(list[j]['date']) < new Date(list[j+1]['date'])){
                let tmp = list[j];
                list[j] = list[j + 1];
                list[j + 1] = tmp;
            }
        }
    }
    return list;
}

async function searchXZ(key, page){
    let list = [];
    if (!page || !key) return false;
    try{
        await fetch(`https://xz.aliyun.com/search?page=${page}&keyword=${encodeURI(key)}`)
        .then(async res => {
            let originPath = 'https://xz.aliyun.com';
            let html = await res.text();
            html = splitHtml(html, '<div id="includeList">', '<div class="pagination clearfix">');
            preDom.innerHTML = html;
            const tdDom = preDom.querySelectorAll('td');
            let L = [];
            if(tdDom){
                for(let item of tdDom){
                    let titleDom = item.querySelector('.topic-title');
                    let url = titleDom.href;
                    url = originPath + (url.substring(url.indexOf('/t/'), url.length));
                    let date = item.querySelector('.topic-info').innerHTML.toString().split('/ ')[1].substr(0,10);
                    let i = generateData(url, titleDom.innerHTML.trim(), "先知社区", date);
                    L.push(i);
                }
            }
            list = L;
        })
    } catch (e){};
    if(list.length) console.log('search xz ok');
    return list;
}

async function searchAnQuanKe(key, page){
    let list = [];
    if (!page || !key) return false;
    try{
        await fetch(`https://api.anquanke.com/data/v1/search?page=${page}&size=20&s=${encodeURI(key)}`, {
            method: 'GET',
            headers: new Headers({
                "Accept": "application/json; charset=utf-8"
            }),
        })
        .then(async res => {
            let originPath = 'https://www.anquanke.com/post/id/';
            const {data} = await res.json();
            let L = [];
            if(data){
                for (let i of data){
                    let o = generateData(originPath + i.id, i.title, "安全客", i.date.substr(0,10));
                    L.push(o);
                }
            }
            list = L;
        })
    } catch (e){};
    if (list) console.log('search aqk ok');
    return list;
}

async function searchWY(key, page, type='by_bugs'){
    if (!page || !key) return false;
    let list = [];
    try{
        await fetch(`https://wooyun.x10sec.org/search?keywords=${encodeURI(key)}&&content_search_by=${type}&&search_by_html=False&&page=${page}`)
        .then(async res => {
            let originPath = 'https://wooyun.x10sec.org/';
            let html = await res.text();
            html = splitHtml(html, '<table class="table table-striped">', '</table>');
            preDom.innerHTML = '<table class="table table-striped">'+html+'</table>';
            let trDom = preDom.querySelectorAll('tr:nth-of-type(n+2)');
            let L = [];
            if(trDom.length){
                for(let item of trDom){
                    let tdDom = item.querySelectorAll('td');
                    let titleDom = tdDom[1].querySelector('a').innerHTML;
                    let url = tdDom[1].querySelector('a').href;
                    url = originPath + (url.substring(url.indexOf('static/'), url.length));
                    let date = tdDom[0].innerHTML;
                    let i = generateData(url, titleDom.trim(), "乌云漏洞库", date);
                    L.push(i);
                }
            }
            list = L;
        })
    } catch (e){};
    if(list.length) console.log('search wy ok');
    return list;
}

async function searchWYarticle(key, page){
    return searchWY(key, page, 'by_drops');
}

async function searchSeeBug(key, page){
    if (!page || !key) return false;
    let list = [];
    try{
        await fetch(`https://www.seebug.org/search/?keywords=${encodeURI(key)}&page=${page}`)
        .then(async res => {
            let originPath = 'https://www.seebug.org';
            let html = await res.text();
            html = splitHtml(html, '<table class="table sebug-table table-vul-list">', '</table>');
            preDom.innerHTML = '<table class="table sebug-table table-vul-list">' + html +'</table>';
            let trDom = preDom.querySelectorAll('tbody > tr');
            let L = [];
            if(trDom.length){
                for(let item of trDom){
                    let aDom = item.querySelector('td.vul-title-wrapper > a');
                    let dDom = item.querySelector('td.datetime');
                    let url = aDom.href;
                    url = originPath + url.substr(url.indexOf('/vuldb/'), url.length);
                    let i = generateData(url, aDom.innerHTML, "seebug漏洞库", dDom.innerHTML);
                    L.push(i);
                }
            }
            list = L;
        })
    } catch (e){console.log(e)};
    if(list.length) console.log('search seebug ok');
    return list;
}

async function searchAnQuanKeCVE(key, page){
    let list = [];
    if (!page || !key) return false;
    try{
        await fetch(`https://api.anquanke.com/data/v1/search/vul?page=${page}&size=20&s=${encodeURI(key)}`, {
            method: 'GET',
            headers: new Headers({
                "Accept": "application/json; charset=utf-8"
            }),
        })
        .then(async res => {
            let originPath = 'https://www.anquanke.com/vul/id/';
            const {data} = await res.json();
            let L = [];
            if(data){
                for (let i of data){
                    let o = generateData(originPath + i.id, i.name, "安全客", i.updated);
                    L.push(o);
                }
            }
            list = L;
        })
    } catch (e){};
    if (list) console.log('search aqkcve ok');
    return list;
}

async function searchSaucsCVE(key, page){
    if (!page || !key) return false;
    let list = [];
    try{
        await fetch(`https://www.saucs.com/search?q=${encodeURI(key)}&page=${page}`)
        .then(async res => {
            let originPath = 'https://www.saucs.com';
            let html = await res.text();
            html = splitHtml(html, '<table class="table">', '</table>');
            preDom.innerHTML = '<table class="table">' + html +'</table>';
            let trTDom = preDom.querySelectorAll('tbody > tr:nth-of-type(2n+1)');
            let trDDom = preDom.querySelectorAll('tbody > tr:nth-of-type(2n)');
            let L = [];
            if(trTDom.length && trDDom.length){
                for(let i = 0; i < trTDom.length; i++){
                    let item = trTDom[i];
                    let aDom = item.querySelector('td:nth-child(1) > a');
                    let dDom = item.querySelector('td.col-md-2.text-center');
                    let detail = trDDom[i].querySelector('td');
                    let url = aDom.href;
                    url = originPath + url.substr(url.indexOf('/cve/'), url.length);
                    let obj = generateData(url, aDom.innerHTML, "saucs漏洞库", dDom.innerHTML, detail.innerHTML);
                    L.push(obj);
                }
            }
            list = L;
        })
    } catch (e){console.log(e)};
    if(list.length) console.log('search saucs cve ok');
    return list;
}