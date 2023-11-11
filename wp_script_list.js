try{(function(){(async $=>{
  let width = 800;
  let style = `<style>
    #script_list {
      letter-spacing: -.40em;
    }
    #script_list li {
      letter-spacing: normal;
      display: inline-block;
      vertical-align: top;
      width: calc(100% / 3);
      text-align: center;
      margin-bottom: 2%;
    }
    #script_list li button {
      -webkit-appearance: none;
      background: #fff;
      border: 1px solid #ccc;
      display: block;
      width: 90%;
      padding: 5% 0;
      font-size: 18px;
      border-radius: 10px;
      outline: 0;
      margin: 0 5% 0;
      transition: .3s;
    }
    #script_list li button:hover {
      background: #4c4c4c;
      border: 1px solid #4c4c4c;
      color: #fff;
      cursor: pointer;
    }
  </style>`;
  let epressbs = $(`
    <p style="font-size: 30px;">制作補助ツール</p>
    <ul id="script_list">
      <li><button id="wp_default_data_setting">初期設定</button></li>
      <li><button id="wp_drop">自動投入（固定）</button></li>
      <li><button id="wp_auto_post">自動投入（投稿）</button></li>
      <li><button id="wp_meta">メタ情報自動設定</button></li>
      <li><button id="wp_upload">ファイルアップロード</button></li>
      <li><button id="wp_contact_mail_build">問い合わせメール自動生成</button></li>
      <li><button id="wp_media">メディアアップロード</button></li>
      <li><button id="wp_mts_data_setting">MTS初期設定</button></li>
      <li><button id="wp_fastest">高速化設定</button></li>
    </ul>
    `+style+`
  `);
  let epressec = $(`
    <p style="font-size: 30px; line-height: 2;">EPRESS-EC制作補助ツール</p>
    <ul id="script_list">
      <li><button id="ex_drop">DropHTML</button></li>
      <li><button id="ex_category">カテゴリデータ投入</button></li>
      <li><button id="ex_item">ダミー商品登録</button></li>
      <li><button id="ex_upload">ファイルアップロード</button></li>
      <li><button id="ex_common">メタ情報修正</button></li>
    </ul>
    `+style+`
  `);
  let rook = $(`
    <p style="font-size: 30px; line-height: 2;">Rook制作補助ツール</p>
    <ul id="script_list">
      <li><button id="image_csv_create">画像csv作成</button></li>
    </ul>
    `+style+`
  `);
  let seed = $(`
    <p style="font-size: 30px;">HPシードWPオプション制作補助ツール</p>
    <ul id="script_list">
      <li><button id="wp_default_data_setting">初期設定</button></li>
      <li><button id="wp_drop">自動投入（固定）</button></li>
      <li><button id="wp_auto_post">自動投入（投稿）</button></li>
      <li><button id="wp_meta">メタ情報自動設定</button></li>
      <li><button id="wp_upload">ファイルアップロード</button></li>
      <li><button id="wp_contact_mail_build">問い合わせメール自動生成</button></li>
      <li><button id="wp_media">メディアアップロード</button></li>
    </ul>
    `+style+`
  `);

  $(document).delegate('#script_list button', 'click', (e)=>{
    let id = e.target.id;
    let user = e.target.dataset.user;
    $('#modal_wrap').fadeOut(function(){ $(this).remove() });
    (function(){
      var o = {script: id, name: user};
      var d = document;
      var s = d.createElement('script');
      s.type="text/javascript";
      s.src = 'https://hamako0.github.io/wp_tools/' + o.script + '.js';
      d.body.appendChild(s);
      d.body.removeChild(s);
    })();
  });
  if( location.pathname.match(/wp-admin/) ){ //wordpress
    let plan = window.PLANTYPE;
    if(typeof plan==='undefined'||plan==='epress' ){
      modal( epressbs, width, 'wp' );
    }else if(plan==='seed'){
      modal( seed, width, 'wp' );
    }else{
      modal( epressbs, width, 'wp' );
    }
  }else if( location.host.match(/control\.xaas\d?\.jp/) ){ //rook
    modal( epressec, width, 'epressec' );
  }else if( $.isFunction(getOriginalHost) ){
    modal( rook, width, 'rook' );
  }

  async function modal( elements, width, planType ){
    let elem = $('<div>', {id:'modal_wrap'}).css({
      'z-index': '100', 'position': 'fixed', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%', 'background-color': 'hsla(0, 0%, 60%, 0.7)'
    }).append(
      $('<div>', {id:'modal_outer'}).css({
        'box-sizing': 'border-box', 'padding': '20px', 'margin': 'auto', 'background': '#ffffff', 'position': 'absolute', 'top': '0', 'bottom': '0', 'left': '0', 'right': '0', 'height': '80%'
      }).append(
        $('<div>', {id:'modal_inner'}).append(
          $('<p>', {id:'modal_headline'}),
          $('<div>', {id:'modal_body'}) ).css({
            'text-align': 'center', 'height': '700px', 'overflow-y': 'scroll', 'overflow-x': 'hidden'
          })
        )
      ).hide();
    $('body').append(
      elem.click(function(e){
        if( e.target.id === 'modal_wrap' ){
          $('#modal_wrap').fadeOut('fast');
          $('#modal_body').empty();
        }
      })
    );
    $('#modal_body').append( elements );
    if(planType==='wp') {
      const version = await phpVersionCheck();
      if(version) $('#script_list').before(`<p style="
        font-size: 20px;
        font-weight: bold;
        color: red;
        border: 1px solid red;
        padding: 5px;
      ">${version}<br><a href="https://www.iflag-moo.com/tools/epress/manual/update/602" target="_blank" style="font-size: 16px;">制作時のPHPバージョンについて</a></p>`);
    }
    $('#modal_wrap').fadeIn('fast');
    $('#modal_outer').width( width + 57 );
  };
  
  async function phpVersionCheck(){
    const obj = {action: 'epress_php_check'};
    const method = 'POST';
    const body = Object.keys(obj).map((key)=>key+'='+encodeURIComponent(obj[key])).join('&');
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    let response = await fetch(ajaxurl, {method, headers, body}).then(r=>{
      return r.status===200? r.text(): false;
    }).catch(()=>false);
    if(response&&response.match(/^7\.2/)){
      console.log(`Current PHP version: ${response}`);
      return false; // `PHPが${response}でOK`;
    }else if(response!==false){
      response = response.replace(/^(\d+?\.\d+?)(\.\d+?)?$/, '$1');
      return `PHPのバージョンは${response}です。`;
    }else{
      return false;
    }
  }
})(jQuery);})();}catch(e){alert('ブックマークレット・エラー\n' + e);}
