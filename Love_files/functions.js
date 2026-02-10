// ================= FECHA DE INICIO =================
// Elige SOLO UNA de las siguientes líneas:

// ================= FECHA DE INICIO =================
// Elige SOLO UNA de las siguientes líneas:

var together = new Date(2025, 10, 7, 0, 0, 0);           // ← la más confiable
// var together = new Date("2025-11-07T00:00:00");
// var together = new Date("2025-11-07T00:00:00-05:00");

// ================= CONTADOR =================
function timeElapse(date) {
    var current = new Date();
    
    var seconds = Math.floor((current.getTime() - date.getTime()) / 1000);

    // Si la fecha futura está adelante → mostramos 00:00:00:00
    if (seconds < 0) {
        $("#days").text("00");
        $("#hours").text("00");
        $("#minutes").text("00");
        $("#seconds").text("00");
        return;
    }

    var days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);

    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Siempre con dos dígitos
    hours   = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    $("#days").text(days);
    $("#hours").text(hours);
    $("#minutes").text(minutes);
    $("#seconds").text(seconds);
}