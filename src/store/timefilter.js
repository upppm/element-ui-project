// 时间过滤器
exports.formaDate = (dateStr, pattern = '') => {
  let str = parseInt(dateStr.toString().padEnd(13, '0'));
  let dt = new Date(str);
  let yy = dt.getFullYear();
  // ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
  let mm = (dt.getMonth() + 1).toString().padStart(2, '0');
  let dd = dt.getDate().toString().padStart(2, '0');
  let h = dt.getHours().toString().padStart(2, '0');
  let m = dt.getMinutes().toString().padStart(2, '0');
  let s = dt.getSeconds().toString().padStart(2, '0');
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return yy + '-' + mm + '-' + dd
  } else {
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s
  }
}