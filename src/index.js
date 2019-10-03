import plugin from './plugin';
if (typeof tinymce !== 'undefined') {
  tinymce.PluginManager.add('tinymceEmoji', plugin);
}
