const optDom = document.querySelectorAll('.opt');
const ldDom = document.querySelector('main > .con > .list > .l_d');
const thDom = document.querySelector('main > h3');
const backDom = document.querySelector('.btn_back');
var data = []
var search_page = 1;
var cur = 'opt1';

for(let item of optDom){
    item.onclick = async () => {
        clearCur();
        search_page = 1;
        ldDom.scrollTop = 0;
        item.classList.add('cur');
        cur = item.id;
        await searching(window.top['search_con'], item.id);
    }
}
function setCur(i){
    clearCur();
    cur = `opt${i}`;
    optDom.forEach((v, i, a) => {
        if (v.id == cur) v.classList.add('cur');
    })
}
function clearCur(){
    for (let item of optDom){
        item.classList.remove('cur');
    }
}
backDom.onclick = window.top.cancelSP;

ldDom.onscroll = () => moreSD();

async function moreSD(){
    inBottomDo(ldDom, () => {
        search_page += 1;
        searching(window.top['search_con'], cur, undefined, 'y')
    })
}

async function searching(v, i, t=0, m='n'){
    i = i ? parseInt(i.replace('opt', '')) : 1;
    switch (parseInt(t)) {
        case 1: i = 1; break;
        case 2: i = 2; break;
        case 3: i = 6; break;
    }
    setCur(i);
    if (!v || !i){setDataToSP('m');return false;}
    if(search_page == 1){
        ldDom.innerHTML = '<img src="../images/loadding.gif" alt="">';
    } else {
        document.querySelector('#l_d_loadding').classList.add('l_d_loadding_show');
    }
    showList(v, i, m);
}

async function showList(v, i, m){
    let d = await switchSApi(v, i, search_page);
    if (m === 'y' && !d.length)alert('已经没有更多内容了');
    data = m === 'y' ? data.concat(d) : d;
    data = orderByDateNew(data);
    if(!data.length) alert('搜索错误或者没有找到内容');
    setDataToSP();
    thDom.innerText = `搜索 ${v} 找到约 ${data.length} 条结果`;
}

/**
 * 不需要参数
 * 会调用这个作用域的 data 来渲染页面
 */
function setDataToSP(type){
    let html = '';
    if (type === 'm'){
        html = '<span class="note">搜索内容不能为空</span>';
        ldDom.innerHTML = html;
        return;
    }
    if(data.length){
        for (let i of data){
            let detail = '';
            if (i.detail){
                detail = `<p>${i.detail}</p>`;
            }
            let h = 
            `
            <a class="l_i ${i.page == search_page ? 'l_n' : ''}" href="${i.url}" target="_blank">
                <h3 style="${i.detail ? 'width: 20%;' : ''}">${i.title}</h3>
                ${detail}
                <span>${i.origin}</span>
                <span>${i.date}</span>
            </a>
            `;
            html += h;
        }
        html += '<div id="l_d_loadding"></div>';
    } else {
        html = '<span class="note">没有搜索到内容</span>';
    };
    ldDom.innerHTML = html;
}