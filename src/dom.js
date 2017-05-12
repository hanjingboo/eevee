import { isIE8 } from './util.js';
import { commentNodeId } from './config.js';


export function walk(dom, fn){
    if (dom.hasChildNodes()) {
        for (var i = 0; i < dom.childNodes.length; i++) {
            if(fn(dom.childNodes[i]) === false) break;
            walk(dom.childNodes[i],fn);
        }
    }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */
export function replaceEl(target, el) {
    var parent = target.parentNode;
    if (parent) {
        parent.replaceChild(el, target);
    }
}

const tagHooks = {
    area: [1, "<map>", "</map>"],
    param: [1, "<object>", "</object>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    legend: [1, "<fieldset>", "</fieldset>"],
    option: [1, "<select multiple='multiple'>", "</select>"],
    thead: [1, "<table>", "</table>"],
    tr: [2, "<table>", "</table>"],
    td: [3, "<table><tr>", "</tr></table>"],
    g: [1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>'],
    //IE8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
    _default: [0, "", ""]
};
tagHooks.th = tagHooks.td;
tagHooks.optgroup = tagHooks.option;
tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead;

"circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use".split(',').forEach((tag)=> {
    tagHooks[tag] = tagHooks.g; //处理SVG
});

const tagNameRE = /<([\w:]+)/;

/**
 * translate a string to a node
 * @param  {string} string
 * @return {element} generated node
 */
export function string2node(string){
    return exports.string2frag(string).childNodes[0];
}

/**
 * translate a string to a frag
 * @param  {string} string
 * @return {fragment}  generated fragment
 */
export function string2frag(string){
    let node = document.createElement('div'),
        frag = document.createDocumentFragment(),
        tag = (tagNameRE.exec(string) || ["", ""])[1].toLowerCase(),
        //取得其标签名
        wrap = tagHooks[tag] || tagHooks._default,
        depth = wrap[0],
        prefix = wrap[1],
        suffix = wrap[2],
        commentData = '';

    //ie8下面有个很奇怪的bug，就是当第一个节点是注释节点，那么这个注释节点渲染不出来
    //所以需要做出特殊处理
    if (isIE8) {
        string = string.replace(/\<\!--([\w-\d]+)--\>/g,`<div id="${commentNodeId}">$1</div>`);
    }

    node.innerHTML = prefix + string.trim() + suffix;

    while (depth--) {
        node = node.lastChild;
    }

    //替换回来
    if (isIE8) {
        walk(node,function(dom){
            if (dom.getAttribute && dom.getAttribute('id') === commentNodeId) {

                commentData = dom.innerHTML;
                //测试发现，当节点是一个th并且第一个不是合法的th，
                //那么会多一个空白的父节点，不是很明白为什么这里特殊处理下
                if (dom.parentNode && dom.parentNode.tagName === "") {
                    dom = dom.parentNode;
                }
                replaceEl(dom, document.createComment(commentData.trim(commentData)));
            }
        });
    }

    let child;
    while (child = node.firstChild) {
        frag.appendChild(child);
    }

    return frag;
}
