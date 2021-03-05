function inBottomDo(dom, cb){
    cb = Object.prototype.toString.call(cb)==='[object Function]' ? cb : () => {};
    let divScrollTop = dom.scrollTop;
    let divClientHeight = dom.clientHeight;
    let divScrollHeight = dom.scrollHeight;
    if(divScrollTop + divClientHeight >= divScrollHeight && dom.scrollTop != 0){
        cb();
    }
}

function splitHtml(html, start, end){
    let h = html.split(start)[1].split(end)[0];
    return h;
}

function getListTemple(){
    return {
        'info': {
            'origin': '',
            'logo': '',
        },
        'data': [],
        'page': 1
    };
}

class selectDom{
    constructor(id){
        let on = false;
        // 拿到 valye 和 图标
        const sDom = document.querySelector(id);
        let stDom = sDom.querySelector('.select_title');
        const svDom = stDom.querySelector('.select_value');
        const siDom = stDom.querySelector('i');
        stDom = null;

        // 拿到选项列表
        const slDom = sDom.querySelector('.select_list');
        const sliDom = slDom.querySelectorAll('.select_list_item');

        sDom.onclick = () => {
            if(on){
                hiddenList();
            }else{
                showList();
                function out({path}){
                    if (path.indexOf(sDom) == -1){
                        on = !on;
                        hiddenList();
                    }
                    document.body.removeEventListener('click', out);
                }
                setTimeout(() => {
                    document.body.addEventListener('click', out);
                }, 300)
            }
            on = !on;
        }
        
        function showList(){
            slDom.classList.add('select_show_list');
            siDom.classList.remove('icon-down');
            siDom.classList.add('icon-up');
        }

        function hiddenList(){
            slDom.classList.remove('select_show_list');
            siDom.classList.remove('icon-up');
            siDom.classList.add('icon-down');
        }
        
        // 初始化变量
        this.svDom = svDom;
        this.sliDom = sliDom;
        this.showList = showList;
        this.hiddenList = hiddenList;
    }

    getSelectValue(){
        return this.svDom.dataset.value;
    }

    setSelectValue(v){
        const opt = this.sliDom[v];
        this.svDom.dataset.value = opt.dataset.value;
        this.svDom.innerText = opt.innerText;
        this.hiddenList();
    }

    initChange(cb){
        cb = Object.prototype.toString.call(cb)==='[object Function]' ? cb : () => {};
        for(let item of this.sliDom){
            item.onclick = function () {
                funproxy(this.dataset.value, this.innerText);
            };
        }

        let _this = this;
        function funproxy(dv, tv){
            _this.svDom.dataset.value = dv;
            _this.svDom.innerText = tv;
            _this.hiddenList();
            cb();
        }

        this.changeCB = cb;
    }
}