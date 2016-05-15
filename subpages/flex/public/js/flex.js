$(document).ready(function () {

    var selectedNumber = $(".flex-item-1");
    var $flexContainerDirection = $("#flex-container-direction");
    var $flexContainerJustify = $("#flex-container-justify");
    var $flexContainerAlignItems = $("#flex-container-align-items");
    var $flexContainerAlignContent = $("#flex-container-align-content");
    var $flexContainerWrap = $("#flex-container-wrap");
    var $flexItem = $(".flex-item");

    var flexContainerColor = "white";
    var flexContainerColorHover = "lightgray";

    var $itemControl = $("#item-control");

    var numberItems = 5;


    function isRowDirection(direction) {
        return direction.charAt(0) === "r";
    }

    function changeFlexDirection(direction) {
        if (isRowDirection($flexContainerDirection.css("flex-direction")) !== isRowDirection(direction)) {

            if (isRowDirection(direction)) {
                $flexContainerDirection.animate({width: 400}, 400, "swing", function () {
                    $flexContainerDirection.css("flex-direction", direction);
                    $flexContainerDirection.animate({height: 100});
                });
            } else {
                $flexContainerDirection.animate({height: 400}, 400, "swing", function () {
                    $flexContainerDirection.css("flex-direction", direction);
                    $flexContainerDirection.animate({width: 100});
                });
            }

        } else {
            $flexContainerDirection.css("flex-direction", direction);
        }
    }

    $flexItem.click(function () {
        $selectedItem = $(this)
        var itemNumber = $selectedItem.attr("data-number");
        $itemControl.removeClass();
        $itemControl.addClass("item-" + itemNumber);
    });

    $("html").click(function () {
        $(".dropdown-content").css("display", "none");
    });

    $(".dropdown").click(function (event) {
        var currentValue = $(".dropdown ." + $(this).attr("data-propertyName")).css("display");
        $(".dropdown-content").css("display", "none");
        if (currentValue === "none") {

            $(".dropdown ." + $(this).attr("data-propertyName")).toggle();
        }
        event.stopPropagation();
    })

    $("#flex-row-direction").find(".dropdown-item").click(function () {
        var value = $(this).attr("data-propertyValue");
        $("#flex-row-direction").find(".dropdown-button").text(value + ";");
        changeFlexDirection(value);
        event.stopPropagation();
    });

    $("#flex-row-justify").find(".dropdown-item").click(function () {
        var value = $(this).attr("data-propertyValue");
        $("#flex-row-justify").find(".dropdown-button").text(value + ";");
        $flexContainerJustify.css("justify-content", value);
        event.stopPropagation();
    });

    $("#flex-row-align-items").find(".dropdown-item").click(function () {
        var value = $(this).attr("data-propertyValue");
        $("#flex-row-align-items").find(".dropdown-button").text(value + ";");
        $flexContainerAlignItems.css("align-items", value);
        event.stopPropagation();
    });

    $("#flex-row-align-content").find(".dropdown-item").click(function () {
        var value = $(this).attr("data-propertyValue");
        $("#flex-row-align-content").find(".dropdown-button").text(value + ";");
        $flexContainerAlignContent.css("align-content", value);
        event.stopPropagation();
    });

    $("#flex-row-wrap").find(".dropdown-item").click(function () {
        var value = $(this).attr("data-propertyValue");
        var minHeight;
        if (value === "nowrap") {
            $flexContainerWrap.css("align-items", "center");
            minHeight = "50px";
        } else {
            $flexContainerWrap.css("align-items", "stretch");
            minHeight = 0;
        }
        $("style").remove();
        $('html > head').append($('<style>.flex-item-wrap { min-height: ' + minHeight + '; }</style>'));
        $("#flex-row-wrap").find(".dropdown-button").text(value + ";");
        $flexContainerWrap.css("flex-wrap", value);
        event.stopPropagation();
    });


    $("#add-item").click(function() {
            var number = ($('div:last-child', $flexContainerWrap).attr("data-number") % 5) + 1;
            if (isNaN(number)) {
                number = 1;
            }
        $flexContainerWrap.append($("<div class='flex-item-wrap item-" + number + "' data-number=" + number + ">"));
    });

    $("#remove-item").click(function() {
        $('div:last-child', $flexContainerWrap).remove();
    });

});