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
        await searching(window.top['search_con'], item.id);
        item.classList.add('cur');
        cur = item.id;
    }
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
        searching(window.top['search_con'], cur, 'y')
    })
}

async function searching(v, i, m){
    i = i ? parseInt(i.replace('opt', '')) : 1;
    if (!v || !i){setDataToSP('m');return false;}
    ldDom.innerHTML = '<img src="../images/loadding.gif" alt="">';
    showList(v, i, m);
    thDom.innerText = `搜索 ${v} 找到约 ??? 条结果 (往下刷就行甭管有多少条结果)`;
}

async function showList(v, i, m){
    m = m ? m : 'n';
    if (m === 'y'){
        let d = await switchSApi(v, i, search_page);
        data = data.concat(d);
        if (!d.length) alert('已经没有更多内容了');
        setDataToSP();
        return;
    }
    data = await switchSApi(v, i, search_page);
    if(!data.length) alert('搜索错误或者没有找到内容');
    setDataToSP();
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
            let h = 
            `
            <a class="l_i" href="${i.url}" target="_blank">
                <h3>${i.title}</h3>
                <span>${i.origin}</span>
                <span>${i.date}</span>
            </a>
            `;
            html += h;
        }
    } else {
        html = '<span class="note">没有搜索到内容</span>';
    };
    ldDom.innerHTML = html;
}