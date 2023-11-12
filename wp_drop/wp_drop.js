try {
  (function () {
    (($) => {
      window.$ = $;
      let timestamp = new Date().getTime();
      let dir = "https://hamako0.github.io/wp_tools/wp_drop/wp_drop.js";
      jQuery("body").append("").append(``).append(``);
    })(jQuery);
  })();
} catch (e) {
  alert("error\n" + e);
}
