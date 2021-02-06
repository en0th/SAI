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