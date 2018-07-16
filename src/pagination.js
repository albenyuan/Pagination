/**
 *
 * @Author Alben Yuan
 * @Date 2018-07-12 15:53
 */
if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
    let version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
    }

    let Pagination = function (element, options) {
        this.$element = $(element);
        options.pageCount = Math.ceil(options.total / options.size);
        options.lastPage = options.pageCount - 1 + options.firstPage;
        this.options = options;
    };

    Pagination.VERSION = '0.0.1';

    Pagination.DEFAULT_OPEIONT = {
        header: {
            firstText: '<<',
            lastText: '>>',
        },
        neighbor: {
            previewText: '<',
            nextText: '>'
        },
        firstPage: 1, // the first pag index
        pageBtn: 5, // 最多展示的分页按钮数
        pageCount: 1, // 页码总数
        lastPage: 1, // 尾页，通过计算得出
        selectedIndex: 1, // 当前页面
        size: 20, // 每一页的数量
        total: 0, // 总数记录数
        click(data, el) {
        }
    };

    let SYSTEM_CONFIG = $.extend({}, Pagination.DEFAULT_OPEIONT);


    /**
     *
     * @param {Object} buttons
     */
    function initHtml(pagination) {
        let buttons = getButtons(pagination);
        let html = '';
        buttons.forEach(function (button) {
            html += '<li class="page ${disabled} ${active}" data-page="${page}"><a class=""  type="button" href="javascript:void(0);">${text}</a></li>'
                .replace(/\${disabled}/g, !button.active && button.disabled ? 'disabled' : ' ')
                .replace(/\${page}/g, button.page)
                .replace(/\${active}/g, button.active)
                .replace(/\${text}/g, button.text);
        });
        return html;
    }

    function getButtons(pagination) {
        let buttons = [];
        let option = pagination.options;
        let pageButtonCount = option.pageBtn;
        let totalPage = Math.ceil(option.total / option.size);
        if (pageButtonCount > totalPage) {
            pageButtonCount = totalPage;
        }
        let btn = {
            page: 0, // 当前按钮的页码
            disabled: '', // 当前页，不可点击
            text: '', // 当前按钮的文本
            active: '', // 当前按钮的状态是否为活跃状态
        };
        if (option.header) {
            // 首页
            buttons.push($.extend({}, btn, {
                disabled: option.selectedIndex == option.firstPage,
                text: option.header.firstText,
                page: option.firstPage
            }));
        }
        if (option.neighbor) {
            // 上一页
            let previewPage = pagination.getPreview();
            buttons.push($.extend({}, btn, {
                disabled: option.selectedIndex == option.firstPage,
                text: option.neighbor.previewText,
                page: previewPage
            }));
        }
        let middle = Math.round(pageButtonCount / 2);
        let btnFirstPage = option.selectedIndex - middle + 1;
        if (btnFirstPage < option.firstPage) {
            btnFirstPage = option.firstPage;
        }
        if ((btnFirstPage + pageButtonCount - 1) > option.lastPage) {
            btnFirstPage = option.lastPage - pageButtonCount + 1;
        }
        for (var index = 0; index < pageButtonCount; index++) {
            var page = index + btnFirstPage;
            buttons.push($.extend({}, btn, {
                page,
                disabled: page == option.selectedIndex,
                active: page == option.selectedIndex ? 'active' : '',
                text: page - option.firstPage + 1,
            }));
        }
        if (option.neighbor) {
            let nextPage = pagination.getNext();
            buttons.push($.extend({}, btn, {
                disabled: (option.selectedIndex == option.lastPage),
                text: option.neighbor.nextText,
                page: nextPage
            })); // 下一页
        }
        if (option.header) {
            buttons.push($.extend({}, btn, {
                disabled: (option.selectedIndex == option.lastPage),
                text: option.header.lastText,
                page: option.lastPage
            })); // 尾页
        }
        return buttons;
    }

    function bindClick(pagination) {
        pagination.$element.find('li a').unbind('click').click(function () {
            $(this).addClass('disabled');
            let $item = $(this).closest('li');
            let data = $item.data();
            if (!$item.hasClass('disabled')) {
                pagination.options.click(data, $(this));
                if (data.page != pagination.options.selectedIndex) {
                    pagination.options.selectedIndex = data.page;
                    pagination.html();
                }
            }
        });
    }

    Pagination.prototype.html = function (html) {
        html = html || initHtml(this);
        this.$element.html(html);
        bindClick(this);
    };


    Pagination.prototype.getShowCount = function () {
        let count = this.getRealCount();
        if (this.neighbor) {
            count += 2;
        }
        if (this.header) {
            count += 2;
        }
        return count;
    };
    Pagination.prototype.getRealCount = function () {
        let options = this.options;
        return options.pageBtn > options.pageCount ? options.pageCount : options.pageBtn;
    };
    Pagination.prototype.isFirst = function () {
        return this.options.selectedIndex <= this.options.firstPage;
    };

    Pagination.prototype.getPreview = function () {
        let options = this.options;
        return this.isFirst() ? options.firstPage : options.selectedIndex - 1;
    };
    Pagination.prototype.getNext = function () {
        let options = this.options;
        return this.isLast() ? options.lastPage : options.selectedIndex + 1;
    };

    Pagination.prototype.isLast = function () {
        let options = this.options;
        return options.selectedIndex >= options.lastPage;
    };

    /**
     *
     * @param {Object} option
     * @param {Object} option.header
     * @param {String} option.header.firstText
     * @param {String} option.header.lastText
     * @param {Object} option.neighbor
     * @param {String} option.neighbor.previewText
     * @param {String} option.neighbor.nextText
     * @param {Number} firstPage: 0, // the first pag index
     * @param {Number} pageBtn: 5, // 最多展示的分页按钮数
     * @param {Number} pageCount: 1, // 页码总数
     * @param {Number} selectedIndex: 1, // 当前页面
     * @param {Number} size: 20, // 每一页的数量
     * @param {Number} total: 0, // 总数记录数
     * @param {Function} click: 0, // 总数记录数
     * @returns {Pagination}
     * @constructor
     */
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var options = $.extend({}, SYSTEM_CONFIG, $this.data(), typeof option == 'object' && option)
            var pagination = new Pagination(this, options);
            pagination.html();
        });
    }

    $.fn.pagination = Plugin;
    $.fn.pagination.Constructor = Pagination;

    $.paginationDefault = function (config) {
        SYSTEM_CONFIG = $.extend(SYSTEM_CONFIG, config);
    };


}(jQuery);