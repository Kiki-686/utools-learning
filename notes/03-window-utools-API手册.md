# window.utools API 手册

## utools.onPluginEnter(callback)
**作用**：当用户通过关键字进入插件时触发。
**示例**：
```javascript
window.utools.onPluginEnter(({ code, type, payload }) => {
  console.log('用户输入的关键字是：', code);
});
```