# Pagination

基于JQuery和Bootstrap的分页插件。页面样式也可以修改。JQuery >= 1.9.1

## 使用

```html
<ul class="pagination"></ul>
```

```javascript

$('.pagination').pagination({
  header:{
    firstText:'', // 第一页文本
    lastText:'' // 最后一页文本
  },
  neighbor:{
    previewText:'', //  上一页文本
    nextText:'', //  下一页文本 
  },
  firstPage: 0, // 第一页的index
  pageBtn: 5, // 最多展示的分页按钮数
  pageCount: 1, // 页码总数
  lastPage: 1, // 尾页，通过计算得出
  selectedIndex: 1, // 当前页面
  size: 20, // 每一页的数量
  total: 0, // 总数记录数
  /**
   *  按钮点击事件，当前页点击后也会出发该事件
   *  @Param {Object} data
   *  @Param {Number} data.page
   *  @Param {Element} el
   */
  click:function(data, el) {
  }
});
```