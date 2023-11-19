try {
  (function () {
    (async ($) => {
      let fileResult = `<?php
        if(!empty($_GET['exists'])&&$_GET['exists']=='regenerate_media'){
          echo 'done';
        }
        // メディアアップロード
        function regenerate_media(){
          global $wpdb;
          $check = $_POST['check'];
            $_filedata = $_FILES['image'];
            $filename = $_filedata['name'];
          $notext = preg_replace( '/.[^.]+$/', '', $filename );
            $wp_upload_dir = wp_upload_dir();
            $image_url = "{$wp_upload_dir['url']}/{$filename}";
            $attachment = $wpdb->get_col($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE guid='%s';", $image_url ));
            $attach_id = $attachment[0];
          if($check==='true'){ // メディアライブラリチェック
            if( empty($attach_id) ){
              $result = array('res' => false, );
            }else{
              $attachment_url = wp_get_attachment_url($attach_id);
              $result = array(
                'res'            => true,
                'attachment_url' => $attachment_url,
              );
            }
            echo json_encode($result);
          }else{ // メディアアップロード
            move_uploaded_file($_filedata['tmp_name'], "{$wp_upload_dir['path']}/{$filename}");
            if( empty($attach_id) ){ // 新規
              $filetype = wp_check_filetype( $filename, null );
              $attachment = array(
                'guid'           => $wp_upload_dir['url'].'/'.$filename,
                'post_mime_type' => $filetype['type'],
                'post_title'     => $notext,
                'post_content'   => '',
                'post_status'    => 'inherit'
              );
              $attach_id = wp_insert_attachment( $attachment, $filename );
            }else{ // 上書き。事前にサムネイルを消す
              $metadata = wp_get_attachment_metadata($attach_id);
              foreach ($metadata['sizes'] as $key => $value) {
                $fileName = $value['file'];
                foreach (glob($wp_upload_dir['path'].'/*') as $file) {
                  if(strpos($file, $fileName) !== false){
                    unlink($file);
                  }
                }
              }
            }
            $filename =  "{$wp_upload_dir['path']}/{$filename}";
            $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
            wp_update_attachment_metadata( $attach_id, $attach_data );
            $result = array('res' => true, );
            echo json_encode($result);
          }
          die();
        }
        add_action( 'wp_ajax_regenerate_media', 'regenerate_media' );`;
    
      let fetchData = {
        obj: {
          action: "get_template_name",
        },
        url: ajaxurl,
        type: "text",
      };
    
      let themeName = await fetchPostWrapper(fetchData);
      if (themeName === "0") themeName = "epress_theme";
      let res = await fileExists(themeName);
    
      if (res.match(/ページが見つかりませんでした/)) {
        res = await createFile(themeName, fileResult);
        if (res.match(/ページが見つかりませんでした/)) {
          alert(`テーマがメディアアップロードに対応していないようです。`);
        } else {
          alert(
            `リロード後有効になります。\nお手数ですがもう一度実行してください。`
          );
          location.href = location.href;
        }
        return;
      }
    
      async function fileExists(themeName) {
        let url = `/wp-content/themes/${themeName}/functions/__mediaUploads.php?exists=regenerate_media`;
        return fetch(url, {
          mode: "same-origin",
          credentials: "include",
        })
          .then((res) => res.text())
          .catch((e) => false);
      }
    
      async function createFile(themeName, fileResult) {
        let fetchData = {
          obj: {
            flagName: "fileUpload",
            path: "../functions/__mediaUploads.php",
            result: fileResult,
          },
          url: `/wp-content/themes/${themeName}/api/api.php`,
          type: "text",
        };
        return await fetchPostWrapper(fetchData);
      }
    
      function fetchPostWrapper(fetchData) {
        let { url, obj, type } = fetchData;
        const body = Object.keys(obj)
          .map((key) => key + "=" + encodeURIComponent(obj[key]))
          .join("&");
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        };
        return fetch(url, {
          method: "POST",
          headers,
          body,
          mode: "same-origin",
          credentials: "include",
        })
          .then((res) => res[type]())
          .catch((e) => false);
      }
    
      window.$ = $;
      let timestamp = new Date().getTime();
      let dir = "//x2627568.xaas3.jp/docs/bookmarklet/wp_media";
      jQuery("body")
        .append('<div id="root"></div>')
        .append(`<link rel="stylesheet" href="${dir}/css/main.css?${timestamp}">`)
        .append(`<script src="${dir}/js/main.js?${timestamp}"></script>`);
    })(jQuery);
  })();
} catch (e) {
  alert("ブックマクレッ・エラー\n" + e);
}
