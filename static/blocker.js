(function () {
  var blocker
  var html

  blocker = document.createElement('div')
  blocker.setAttribute('id', 'blocker-container')

  html += '<div class="blocker-dialog">'
  html += '  <div class="title">'
  html += '    <h1>你正在使用旧版浏览器<\/h1>'
  html += '    <p>为了您资金安全以及更好的游戏体验, 建议选择下列浏览器中的一款<\/p>'
  html += '  <\/div>'
  html += '  <ul class="browsers">'
  html += '    <li>'
  html += '      <a class="link" href="http:\/\/www.google.com\/chrome\/browser\/desktop\/index.html">'
  html += '        <img class="img" src="http://icons.iconarchive.com/icons/cornmanthe3rd/plex/256/Internet-chrome-icon.png"/>'
  html += '        <div class="download">谷歌浏览器<\/div><span class="recommend">推荐<\/span>'
  html += '      <\/a>'
  html += '    <\/li>'
  html += '    <li>'
  html += '      <a class="link" href="https:\/\/browser.360.cn\/se\/">'
  html += '        <img class="img" src="https://i0download.pchome.net/g1/M00/08/04/oYYBAFN0Lg2IVp_SAADF669ldkIAABh7QKbKLUAAMYD687.png"/>'
  html += '        <div class="download">360浏览器<\/div>'
  html += '      <\/a>'
  html += '    <\/li>'
  html += '    <li>'
  html += '      <a class="link" href="https:\/\/www.mozilla.org\/zh-CN\/firefox\/new\/">'
  html += '        <img class="img" src="https://ep01.epimg.net/tecnologia/imagenes/2009/11/02/actualidad/1257156064_850215_0000000000_sumario_normal.jpg"/>'
  html += '        <div class="download">火狐浏览器<\/div>'
  html += '      <\/a>'
  html += '    <\/li>'
  html += '    <li>'
  html += '      <a class="link" href="http:\/\/pc.uc.cn\/">'
  html += '        <img class="img" src="http://icons.iconarchive.com/icons/martz90/circle/512/uc-browser-icon.png"/>'
  html += '        <div class="download">UC浏览器<\/div>'
  html += '      <\/a>'
  html += '    <\/li>'
  html += '    <li>'
  html += '      <a class="link" href="https:\/\/ie.sogou.com\/">'
  html += '        <img class="img" src="https://www.newasp.net/attachment/soft/2015/0716/160851_27297161.png"/>'
  html += '        <div class="download">搜狗浏览器<\/div>'
  html += '      <\/a>'
  html += '    <\/li>'
  html += '  <\/ul>'
  html += '<\/div>'
  html += '<div class="blocker-mask"><\/div>'

  blocker.innerHTML = html

  window.onload = function () {
    document.body.appendChild(blocker)
    blocker.style.display = 'block'
  }
})()
