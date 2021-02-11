var PL = ['先知社区', '安全客', 'freebuf', 'freebuf快讯', 'seebug'];

var aListData_1 = new getListTemple();
var aListData_2 = new getListTemple();
var search_con = '';

const mask = document.querySelector('#mask');
const ALS1 = document.querySelector('#AL1');
const ALS2 = document.querySelector('#AL2');
ALS1.onchange = () => changeData(ALS1.value, 1);
ALS2.onchange = () => changeData(ALS2.value, 2);
const AS1 = document.querySelector('.a_as');
const AS2 = document.querySelectorAll('.a_as')[1];
AS1.onscroll = () => moreData(AS1, 1);
AS2.onscroll = () => moreData(AS2, 2);
const searchDom = document.querySelector('#search');
const SPDom = document.querySelector('iframe');
searchDom.onkeydown = async (e) => {
    let event = e || window.event;
    if (event.keyCode == 13){
        await SPDom.contentWindow.searching(searchDom.value, SPDom.contentWindow.cur);
        SPDom.classList.add('on_ext');
    }
}
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
ALS1.value= als1_cus;
ALS2.value= als2_cus;
window.onload = async () => {
    await Promise.all([
        changeData(ALS1.value, 1),
        changeData(ALS2.value, 2)
    ]);
    mask.classList.add('mask_hidden');
}

// 渲染页面
async function setDataToPage(dataList, index){
    index = index >= 1 && index <= 2 ? index : '';
    if (!dataList || !index)return false;
    const aLdom = document.querySelector(`main .a_l:nth-of-type(${index})`);
    const aSdom = aLdom.querySelector('.a_as');
    const aTdom = aLdom.querySelector('.a_t > .a_t_box > select');
    let {data, info: {origin}} = dataList;
    aTdom.value = PL.indexOf(origin);
    let ALL = '';
    for (let item of data){
        let html =         
        `
            <div class="a_i">
                <a href="${item.url}"></a>
                <div class="a_c">
                    <h3>${item.title}</h3>
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
    originID = originID >= 0 && originID < PL.length ? originID : 0;
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
    let v = document.querySelector(`#AL${i}`).value
    changeData(v, i, 'more');
}