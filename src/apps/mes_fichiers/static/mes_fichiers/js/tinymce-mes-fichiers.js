tinymce.PluginManager.add('mes_fichiers', function(editor, url) {
    var _window = null;
    var _fieldId = null;
    var _win = null;

    window.openMesFichiersManager = openMesFichiersManager;

    function openMesFichiersManager(fieldId, url, type, win) {
        _fieldId = fieldId;
        _win = win;

        if (_window) {
            return _window.show();
        }

        _window = editor.windowManager.open({
            title: 'Mes Fichiers',
            url: '/mes_fichiers/',
            width: window.innerWidth * 0.8,
            height: window.innerHeight * 0.8,
            movable: true,
            inline: true,
            close_previous: 'no'
        });
        _window.close = _window.hide;

        window.addEventListener('message', function(e) {
            var file = e.data;
            var input = _win.document.getElementById(_fieldId);
            input.value = file.url;
            _window.close();
        });
    }
})();