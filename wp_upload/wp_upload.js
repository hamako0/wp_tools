(($) => {
  window.$ = $;
  let timestamp = new Date().getTime();
  let dir = "//x2627568.xaas3.jp/docs/bookmarklet/wp_upload";
  jQuery("body")
    .append('<div id="root"></div>')
    .append(`<link rel="stylesheet" href="${dir}/css/main.css?${timestamp}">`)
    .append(`<script src="${dir}/js/main.js?${timestamp}"></script>`);
})(jQuery);
