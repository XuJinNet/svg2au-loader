/**
 * Copyright (c) 2010-2016 EEFUNG Software Co.Ltd. All rights reserved.
 * 版权所有(c)2010-2016湖南蚁坊软件有限公司。保留所有权利。
 */

/**
 * Webpack Loader: Convert SVG file to Aurelia Component ( Custom Element )
 * Created by xujin on 16/9/17.
 */

const template = require('lodash/template');
const startCase = require('lodash/startCase');

const customElementTemplate = template(`
import {containerless, inlineView, bindable} from 'aurelia-framework';

@containerless()
@inlineView('<template><svg role="img" class.bind="styleClass" style.bind="style" <%= viewBox %>><title if.bind="title">$\\{title}</title><%= svgContent %></svg></template>')
export class <%= elementClassName %>CustomElement {
    styleClass;
    style;
    title;
    
    activate(attributes) {
        this.styleClass = attributes.styleClass;
        this.style = attributes.style;
        this.title = attributes.title;
    }
}`);

module.exports = function (source) {
    // this.cacheable();

    // 抽取 svg 元素上的 viewBox Attribute (如果 svg 元素上没有 viewBox, CSS 设置 svg 元素大小无效)
    const viewBox = source.match(/<svg[^>]*(viewBox="[\d ]+")[^>]*>/)[1];
    const svgContent = source
        // 抽取需要的内容
        .replace(/^<svg[^>]*>(.+)<\/svg>$/, '$1')
        // 转义单引号
        .replace('\'', '\\\'');

    const filename = this.resourcePath.replace(/^(?:[^\/]*\/)*([^\/]+).svg$/, '$1');

    // 转换成 Aurelia 自定义元素
    return customElementTemplate({
                                     viewBox: viewBox,
                                     svgContent: svgContent,
                                     elementClassName: convertToCamelCase(filename)
                                 });
}

/**
 * 转换 dash-case 到 camel-case
 * @param {string} dashCash 横线模式字符串
 */
function convertToCamelCase(dashCase) {
    return startCase(dashCase).replace(/\s*/g, '');
}