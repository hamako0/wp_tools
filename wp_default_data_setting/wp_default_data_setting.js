(async $ => {
  if (typeof window.PLANTYPE !== 'undefined') {
    const account = prompt(`
      お客様の本ドメインを入力してください。
      例： iflag.co.jp
    `);
    if (!account) return false;
    const domain = location.origin + location.pathname.replace(/^(.+?)wp-admin.+/, '$1');
    addStyle();
    let ajaxOption = {
      type: 'post',
      url: ajaxurl,
      data: {
        action: 'default_data_setting',
        account: account,
        plan: PLANTYPE,
      }
    };
    let response = await $.ajax(ajaxOption);
    location.href = domain + 'wp-admin/edit.php?post_type=page';
  } else {
    alert('テーマを有効化してください。');
  }
 
  function addStyle(){
    $('#wpwrap').append(`<p class="wpwrap_text">初期設定を行っています・・・</p>`);
    let css = `#wpwrap{z-index:0;height:calc(100vh - 32px);overflow:hidden}#wpwrap:after{content:'';display:block;position:absolute;top:0;bottom:0;right:0;left:0;margin:auto;background-image:linear-gradient(to bottom,#fff 0,#000 100%);opacity:.3;height:calc(100vh - 32px);width:100%;z-index:9999}#wpwrap .wpwrap_text{position:absolute;top:50%;right:0;left:0;transform:translateY(-50%);margin:auto;text-align:center;font-size:40px;font-weight:bold;z-index:10000}`;
    let style = $('<style>');
    style.append(css);
    $('head').append(style);
  }
