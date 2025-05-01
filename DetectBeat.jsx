(function () {
    // Создаем окно настроек
    var win = new Window("dialog", "Обнаружение бита");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Группа для слоя аудио
    var audioGroup = win.add("panel", undefined, "Слой аудио");
    audioGroup.orientation = "column";
    audioGroup.alignChildren = ["fill", "top"];
    audioGroup.spacing = 5;
    audioGroup.margins = 10;

    var audioLayerNameGroup = audioGroup.add("group");
    audioLayerNameGroup.orientation = "row";
    audioLayerNameGroup.add("statictext", undefined, "Имя слоя аудио:");
    var audioLayerName = audioLayerNameGroup.add("edittext", undefined, "Амплитуда аудио");
    audioLayerName.characters = 20;

    var effectNameGroup = audioGroup.add("group");
    effectNameGroup.orientation = "row";
    effectNameGroup.add("statictext", undefined, "Имя эффекта:");
    var effectName = effectNameGroup.add("edittext", undefined, "Оба канала");
    effectName.characters = 20;

    var sliderNameGroup = audioGroup.add("group");
    sliderNameGroup.orientation = "row";
    sliderNameGroup.add("statictext", undefined, "Имя контроллера:");
    var sliderName = sliderNameGroup.add("edittext", undefined, "Ползунок");
    sliderName.characters = 20;

    // Группа для настроек обнаружения
    var settingsGroup = win.add("panel", undefined, "Настройки обнаружения");
    settingsGroup.orientation = "column";
    settingsGroup.alignChildren = ["fill", "top"];
    settingsGroup.spacing = 5;
    settingsGroup.margins = 10;

    // Порог амплитуды
    var thresholdGroup = settingsGroup.add("group");
    thresholdGroup.orientation = "row";
    thresholdGroup.add("statictext", undefined, "Порог амплитуды:");
    var thresholdSlider = thresholdGroup.add("slider", undefined, 15, 0, 100);
    var thresholdValue = thresholdGroup.add("edittext", undefined, "15");
    thresholdValue.characters = 4;

    thresholdSlider.onChanging = function () {
        thresholdValue.text = Math.round(thresholdSlider.value);
    };
    thresholdValue.onChange = function () {
        var val = parseFloat(thresholdValue.text);
        if (!isNaN(val)) {
            thresholdSlider.value = val;
        }
    };

    // Минимальный интервал
    var intervalGroup = settingsGroup.add("group");
    intervalGroup.orientation = "row";
    intervalGroup.add("statictext", undefined, "Мин. интервал (сек):");
    var intervalSlider = intervalGroup.add("slider", undefined, 0.25, 0.01, 1);
    var intervalValue = intervalGroup.add("edittext", undefined, "0.25");
    intervalValue.characters = 4;

    intervalSlider.onChanging = function () {
        intervalValue.text = intervalSlider.value.toFixed(2);
    };
    intervalValue.onChange = function () {
        var val = parseFloat(intervalValue.text);
        if (!isNaN(val)) {
            intervalSlider.value = val;
        }
    };

    // Имя маркера
    var markerGroup = settingsGroup.add("group");
    markerGroup.orientation = "row";
    markerGroup.add("statictext", undefined, "Имя маркера:");
    var markerName = markerGroup.add("edittext", undefined, "Beat");
    markerName.characters = 20;
    
    // Нумерация маркеров
    var numberingGroup = settingsGroup.add("group");
    numberingGroup.orientation = "row";
    var numberingCheckbox = numberingGroup.add("checkbox", undefined, "Добавить нумерацию маркеров");
    numberingCheckbox.value = false;
    
    // Формат нумерации
    var formatGroup = numberingGroup.add("group");
    formatGroup.orientation = "row";
    var formatBefore = formatGroup.add("radiobutton", undefined, "# перед");
    var formatAfter = formatGroup.add("radiobutton", undefined, "# после");
    formatBefore.value = true;
    
    numberingCheckbox.onClick = function() {
        formatGroup.enabled = numberingCheckbox.value;
    };
    
    formatGroup.enabled = numberingCheckbox.value;

    // Цвет маркера
    var colorGroup = settingsGroup.add("group");
    colorGroup.orientation = "row";
    colorGroup.add("statictext", undefined, "Цвет маркера:");
    var colorDropdown = colorGroup.add("dropdownlist", undefined, ["Нет", "Красный", "Зеленый", "Синий", "Голубой", "Пурпурный", "Желтый", "Розовый", "Оранжевый"]);
    colorDropdown.selection = 0;

    // Кнопки управления
    var buttonGroup = win.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["center", "top"];
    
    var cancelButton = buttonGroup.add("button", undefined, "Отмена");
    var okButton = buttonGroup.add("button", undefined, "OK");
    okButton.helpTip = "Запустить обнаружение бита";

    // Функция для получения цвета маркера
    function getMarkerColor(colorName) {
        switch (colorName) {
            case "Красный": return 1;
            case "Зеленый": return 2;
            case "Синий": return 3;
            case "Голубой": return 4;
            case "Пурпурный": return 5;
            case "Желтый": return 6;
            case "Розовый": return 7;
            case "Оранжевый": return 8;
            default: return 0; // Нет
        }
    }

    // Обработчик кнопки OK
    okButton.onClick = function () {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Пожалуйста, выберите композицию!");
            return;
        }

        var audioLayer;
        try {
            audioLayer = comp.layer(audioLayerName.text);
        } catch (e) {
            alert("Не найден слой '" + audioLayerName.text + "'.");
            return;
        }

        var slider;
        try {
            slider = audioLayer.effect(effectName.text)(sliderName.text);
        } catch (e) {
            alert("Не найден эффект '" + effectName.text + " > " + sliderName.text + "'.");
            return;
        }

        var threshold = parseFloat(thresholdValue.text);
        var minInterval = parseFloat(intervalValue.text);
        var markerText = markerName.text;
        var markerColor = getMarkerColor(colorDropdown.selection.text);
        var useNumbering = numberingCheckbox.value;
        var numberBefore = formatBefore.value;

        app.beginUndoGroup("Авто Beat Маркеры");

        var lastMarkerTime = -minInterval;
        var fps = comp.frameRate;
        var duration = comp.duration;
        var markersAdded = 0;
        var markerCount = 1;

        for (var t = 0; t < duration; t += 1 / fps) {
            var amp = slider.valueAtTime(t, false);
            if (amp >= threshold && (t - lastMarkerTime) >= minInterval) {
                var finalMarkerText = markerText;
                
                // Добавляем нумерацию если включена
                if (useNumbering) {
                    if (numberBefore) {
                        finalMarkerText = markerCount + " " + markerText;
                    } else {
                        finalMarkerText = markerText + " " + markerCount;
                    }
                    markerCount++;
                }
                
                var marker = new MarkerValue(finalMarkerText);
                if (markerColor > 0) {
                    marker.label = markerColor;
                }
                comp.markerProperty.setValueAtTime(t, marker);
                lastMarkerTime = t;
                markersAdded++;
            }
        }

        alert("Готово! Добавлено " + markersAdded + " маркеров на пиках аудио.");
        app.endUndoGroup();
        win.close();
    };

    // Обработчик кнопки Отмена
    cancelButton.onClick = function () {
        win.close();
    };

    // Показываем окно
    win.center();
    win.show();
})();