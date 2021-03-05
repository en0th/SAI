var setting = {};

var aListData_1 = new getListTemple();
var aListData_2 = new getListTemple();
var search_con = '';
var search_opt = 1;

// 初始化
const mask = document.querySelector('#mask');
const search_select = new selectDom('#search_select');
search_select.initChange(() => {search_opt = search_select.getSelectValue()});
const ALS1 = new selectDom('#AL1');
const ALS2 = new selectDom('#AL2');
const AS1 = document.querySelector('.a_as');
const AS2 = document.querySelectorAll('.a_as')[1];
AS1.onscroll = () => moreData(AS1, 1);
AS2.onscroll = () => moreData(AS2, 2);
ALS1.initChange(() => { aListData_1.page = 1; AS1.scrollTop = 0; changeData(ALS1.getSelectValue(), 1); })
ALS2.initChange(() => { aListData_2.page = 1; AS2.scrollTop = 0; changeData(ALS2.getSelectValue(), 2); })
const searchDom = document.querySelector('#search');
const SPDom = document.querySelector('iframe');
// 进行搜索
searchDom.onkeydown = async (e) => {
    let event = e || window.event;
    if (event.keyCode == 13)doSearch();
}
function doSearch(){
    SPDom.contentWindow.searching(searchDom.value, SPDom.contentWindow.cur, search_opt);
    SPDom.classList.add('on_ext');
}
document.querySelector('.search_box > i').onclick = doSearch;
searchDom.onchange = () => search_con = searchDom.value;
function cancelSP(){
    SPDom.classList.remove('on_ext');
}

// 初始化
// 拿到存储的值
let als1_cus = parseInt(localStorage.getItem('als1_cus'));
let als2_cus = parseInt(localStorage.getItem('als2_cus'));
// 如果拿不到就做默认值
if(!als1_cus){localStorage.setItem('als1_cus', 0);als1_cus = 0;}
if(!als2_cus){localStorage.setItem('als1_cus', 1);als2_cus = 1;}
ALS1.setSelectValue(als1_cus);
ALS2.setSelectValue(als2_cus);
window.onload = async () => {
    setting = await fetch('./setting.json').then(async (res) => await res.json());
    setingValue();
    await Promise.all([
        changeData(ALS1.getSelectValue(), 1),
        changeData(ALS2.getSelectValue(), 2)
    ]);
    mask.classList.add('mask_hidden');
}

// 渲染页面
async function setDataToPage(dataList, index){
    index = index >= 1 && index <= 2 ? index : '';
    if (!dataList || !index)return false;
    const aLdom = document.querySelector(`main .a_l:nth-of-type(${index})`);
    const aSdom = aLdom.querySelector('.a_as');
    let {data} = dataList;
    let ALL = '';
    for (let item of data){
        let html =         
        `
            <div class="a_i ${item.summary ? 'a_hs': ''}">
                <a href="${item.url}"></a>
                <div class="a_c">
                    <h3>${item.title}</h3>
                    ${item.summary ? `<p class="a_sum">${item.summary}<p>`: ''}
                    <p>${item.author}</p>
                </div>
            </div>
        `;
        ALL += html;
    }
    ALL += `
        <a href="#" class="more">查阅更多</a>
    `;
    aSdom.innerHTML = ALL;
    aSdom.querySelector('.more').onclick = () => letMore(index);
}

async function changeData(originID, index, type){
    if(!originID && !index) return false;
    let tmpObj = {};
    Object.assign(tmpObj, window[`aListData_${index}`]);
    const {info, data} = await switchOrigin(originID, tmpObj.page);
    tmpObj.info = info;
    tmpObj.data = type === 'more' ? tmpObj.data.concat(data) : data;
    await setDataToPage(tmpObj,index);
    window[`aListData_${index}`] = tmpObj;
    localStorage.setItem(`als${index}_cus`, originID)
}

async function moreData(oDom, index){
    inBottomDo(oDom, () => letMore(index))
}

function letMore(i){
    window[`aListData_${i}`].page += 1;
    let v = i === 1 ? ALS1.getSelectValue() : ALS2.getSelectValue();
    changeData(v, i, 'more');
}

function setingValue(){
    const bLDOM = document.querySelector('.b_l');
    let bL_html = '';
    for (let i of setting.blogLinks){
        bL_html += `<a href="${i.url}" class="b_i">${i.title}</a>`;
    }
    bLDOM.innerHTML = bL_html;
}