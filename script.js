(function () {
    var canvas = $('#canvas');

    if (!canvas[0].getContext) {
        $("#error").show();
        return false;
    }

    var width = canvas.width();
    var height = canvas.height();

    canvas.attr("width", width);
    canvas.attr("height", height);

    var opts = {
        seed: {
            x: width / 2 - 20,
            color: "rgb(190, 26, 37)",
            scale: 2
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 700,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    }

    var tree = new Tree(canvas[0], width, height, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    canvas.click(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        if (seed.hover(x, y)) {
            hold = 0;
            canvas.unbind("click");
            canvas.unbind("mousemove");
            canvas.removeClass('hand');
        }
    }).mousemove(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        canvas.toggleClass('hand', seed.hover(x, y));
    });

    var seedAnimate = eval(Jscex.compile("async", function () {
        seed.draw();
        while (hold) {
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canScale()) {
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);

        canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
        canvas.css("background", "#F5E8DC");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var jumpAnimate = eval(Jscex.compile("async", function () {
        var ctx = tree.ctx;
        while (true) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile("async", function () {
    $("#code").show().typewriter();  // typewriter del mensaje

    // Esperamos un poco para que el árbol termine de crecer
    $await(Jscex.Async.sleep(8000));  // 8 segundos de espera (ajusta si quieres más/menos)

    $("#clock-box").fadeIn(1500);    // fade suave del contador (1.5 seg)

    // Iniciamos el conteo real aquí (para que no aparezca antes)
    var together = new Date(2025, 10, 7, 0, 0, 0);
    timeElapse(together);            // primera actualización
    setInterval(function() { timeElapse(together); }, 1000);
}));
    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());

        textAnimate().start();

        $await(jumpAnimate());
    }));

    runAsync().start();
})();
$(document).ready(function() {
    var together = new Date(2025, 10, 7);
    setInterval(function() {
        timeElapse(together);
    }, 1000);
    timeElapse(together);  // inmediato
    console.log("Modo emergencia: contador forzado");
});
// Al final del archivo (antes del último });
$(document).ready(function() {
    var together = new Date(2025, 10, 7, 0, 0, 0);

    // Ocultamos el clock-box al inicio para controlarlo después
    $("#clock-box").hide();

    function updateClock() {
        timeElapse(together);
    }

    // No iniciamos el intervalo aquí todavía — lo haremos después del árbol
    console.log("Contador preparado");
});
$(document).ready(function() {
    // Contador siempre activo (pero el cuadro #clock-box sigue oculto hasta el fade)
    var together = new Date(2025, 10, 7, 0, 0, 0);
    function updateClock() {
        timeElapse(together);
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Esperamos MUCHO MÁS para que el árbol termine casi todo
    setTimeout(function() {
        var $code = $("#code");
        var htmlOriginal = $code.html();
        
        $code.html('');
        $code.show();

        var buffer = '';
        var i = 0;

        function typeWriter() {
            if (i < htmlOriginal.length) {
                var char = htmlOriginal.charAt(i);
                buffer += char;

                if (char === '>' || i === htmlOriginal.length - 1) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = buffer;
                    var node = tempDiv.firstChild || document.createTextNode(buffer);
                    $code[0].appendChild(node);
                    buffer = '';
                }

                i++;
                setTimeout(typeWriter, 70);  // 70ms → un poquito más lento y romántico
            } else {
                // Cuando termina el texto → fade del contador
                setTimeout(function() {
                    $("#clock-box").fadeIn(3000);  // fade más lento y bonito (3 segundos)
                }, 2000);  // espera 2 segundos después de terminar las letras
            }
        }

        typeWriter();
    }, 18000);  // ← 18 segundos de espera: da tiempo a que el árbol crezca, florezca y empiece a saltar
});
// Variable para saber si ya se inició la animación después del click
var animationStarted = false;

// Sobreescribimos el draw de la semilla para detectar cuando se hace click
var originalSeedDraw = Seed.prototype.draw;
Seed.prototype.draw = function() {
    originalSeedDraw.apply(this, arguments);

    // Cuando se hace click en el corazón inicial (hold pasa a 0)
    if (hold === 0 && !animationStarted) {
        animationStarted = true;

        // Esperamos que el árbol crezca bonito antes de escribir el texto
        setTimeout(function() {
            var $code = $("#code");
            var textoOriginal = $code.html();  // ya es limpio, sin spans

            $code.html('');                    // limpia
            $code.show();                      // muestra el contenedor

            var i = 0;
            function escribirLetra() {
                if (i < textoOriginal.length) {
                    // Añadimos letra por letra respetando <br> y HTML simple
                    $code[0].innerHTML += textoOriginal.charAt(i);
                    i++;
                    setTimeout(escribirLetra, 60);  // 60 ms por letra → ajusta a 80 o 100 si quieres más lento
                } else {
                    // Cuando termina de escribir → aparece el contador con fade
                    setTimeout(function() {
                        $("#clock-box").fadeIn(2500);  // fade suave de 2.5 segundos
                    }, 1500);  // espera 1.5 segundos después de terminar el texto
                }
            }

            escribirLetra();
        }, 12000);  // 12 segundos después del click → ajusta a 15000 o 18000 si quieres esperar más al árbol

        // El contador empieza a contar desde el momento del click
        var together = new Date(2025, 10, 7, 0, 0, 0);
        function updateClock() {
            timeElapse(together);
        }
        updateClock();
        setInterval(updateClock, 1000);
    }
};