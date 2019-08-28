import EmojiFile from './emoji';

const plugin = (editor) => {
  var add_space = true;
  if ("emoji_add_space" in editor.settings) {
    add_space = editor.settings.emoji_add_space;
  }

  var show_groups = true;
  if ("emoji_show_groups" in editor.settings) {
    show_groups = editor.settings.emoji_show_groups;
  }

  var show_subgroups = true;
  if ("emoji_show_subgroups" in editor.settings) {
    show_subgroups = editor.settings.emoji_show_subgroups;
  }

  var show_tab_icons = true;
  if ("emoji_show_tab_icons" in editor.settings) {
    show_tab_icons = editor.settings.emoji_show_tab_icons;
  }

  var show_group_name = true;
  if ("emoji_show_group_name" in editor.settings) {
    show_group_name = editor.settings.emoji_show_group_name;
  }

  var emoji_dialog_height = 600;
  if ("emoji_dialog_height" in editor.settings) {
    emoji_dialog_height = parseInt(editor.settings.emoji_dialog_height, 10);
  }

  var emoji_dialog_width = show_tab_icons ? 900 : 800;
  if ("emoji_dialog_width" in editor.settings) {
    emoji_dialog_width = parseInt(editor.settings.emoji_dialog_width, 10);
  }

  var emoji_close_on_insert = false;
  if ("emoji_close_on_insert" in editor.settings) {
    emoji_close_on_insert = editor.settings.emoji_close_on_insert;
  }


  var getBody = new Promise((resolve, reject) => {
    try {
      let body = [];
      let groupHtml = show_groups ? '' : '<div id="start-icons-no-groups">';
      for (let group of EmojiFile) {
        groupHtml = show_groups ? '<div>' : groupHtml;
        let tabIcon = '';
        for (let subgroup of group.subGroups) {
            groupHtml += show_subgroups ? '<p style="clear:both"><strong>' + subgroup.name.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase()) + '</strong><br/>' : '';
          for (let emoji of subgroup.emojis) {
            if (tabIcon === '') {
              tabIcon = emoji.emoji;
            }
            groupHtml += '<span style="float:left; padding: 4px; font-size: 1.5em; cursor: pointer;" data-chr="' + emoji.emoji + '">' + emoji.emoji + '</span>';
          }
          if (show_groups) {
            groupHtml += '</p>';
          }
        }
        groupHtml += show_groups ? '</div>' : '';
        if (show_groups) {
          body.push({
            type: 'container',
            title: (show_tab_icons ? tabIcon : '') + (show_group_name ? ' ' + group.name : ''),
            html: groupHtml,
            onclick: function (e) {
              var target = e.target;
              if (/^(SPAN)$/.test(target.nodeName)) {
                if (target.hasAttribute('data-chr')) {
                  let char = target.getAttribute('data-chr');
                  console.log(add_space);
                  editor.execCommand('mceInsertContent', false, char + (add_space ? ' ' : ''));
                  if (emoji_close_on_insert) {
                    editor.windowManager.close();
                  }
                }
              }
            }
          });
        }
      }
      if (!show_groups) {
        groupHtml += '</div>';
        body.push({
          type: 'container',
          html: groupHtml,
          onclick: function (e) {
            var target = e.target;
            if (/^(SPAN)$/.test(target.nodeName)) {
              if (target.hasAttribute('data-chr')) {
                let char = target.getAttribute('data-chr');
                console.log(add_space);
                editor.execCommand('mceInsertContent', false, char + (add_space ? ' ' : ''));
                if (emoji_close_on_insert) {
                  editor.windowManager.close();
                }
              }
            }
          }
        });
      }
      resolve(body);
    } catch (error) {
      reject(error);
    }

  });

  function getLoadingHtml() {
    return '<img src="' + LoaderGIF + '" alt="Loading" />';
  }

  function showDialog() {
    getBody.then(body => {
      var win = editor.windowManager.open({
        autoScroll: true,
        width: emoji_dialog_width,
        height: emoji_dialog_height,
        title: tinymce.translate('Insert Emoji'),
        bodyType: show_groups ? 'tabPanel' : 'container',
        layout: 'fit',
        body,
        buttons: [{
          text: 'Close',
          onclick: () => {
            win.close();
          }
        }]
      });
    }).then(() => {
      let el = document.getElementById('start-icons-no-groups');
      if (el) {
        el.closest(".mce-container.mce-abs-layout-item.mce-first.mce-last").style.height = '100%';
        el.closest(".mce-container.mce-abs-layout-item.mce-first.mce-last").firstElementChild.style.height = '100%';
      }
    }).catch(error => {
      console.log(error);
    });
  }

  editor.addCommand('emojiShowDialog', showDialog);

  editor.addButton('tinymceEmoji', {
    text: '😀 ',
    icon: false,
    cmd: 'emojiShowDialog'
  });

  editor.addMenuItem('tinymceEmoji', {
    text: 'Emoji',
    icon: 'emoticons',
    context: 'insert',
    cmd: 'emojiShowDialog'
  });
};

export default plugin;