
var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET',url,true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if(status == 200) {
			callback(null,xhr.response);
		} else {
			callback(status, xhr.response);
		}
	}
	xhr.send();
}

document.getElementById("footer").addEventListener("click", openChangelly);
function openChangelly() {
	var win = window.open("https://changelly.com/widget/v1?auth=email&from=USD&to=BTC&merchant_id=62261ad5f055&address=&amount=1&ref_id=62261ad5f055&color=3a6ec2", '_blank');
  	win.focus();
}

function priceFetch(err,data) {
	if(err !== null) {
		alert("Something went wrong. We are working to fix it asap.");
	} else {
		var coinObject = [];
		var j = data;
		for(i=0; i<j.length; i++) {
			if(j[i].id == "bitcoin" || j[i].id == "ethereum" || j[i].id == "atc-coin" || j[i].id == "litecoin" || j[i].id == "ripple" ){
			let obj = {};
			obj.name = j[i].name;
			obj.rank = j[i].rank;
			obj.price = j[i]["price_"+localStorage["curr"].toLowerCase()];
			obj.percent_change_24h = j[i].percent_change_24h;
			coinObject.push(obj);

			var row = obj;

			var table =  document.getElementById("priceTable");
			var tableRow = table.insertRow(-1);

			var cel_1 = tableRow.insertCell(0);
			var cel_2 = tableRow.insertCell(1);

			cel_1.innerHTML = row.name;
			cel_2.innerHTML = '<div class="price-cell">' + row.price + '</div>'; 

			var priceChangeClass = (row.percent_change_24h > 0) ? "price-green" : "price-red";
			var priceChangeIcon = (row.percent_change_24h > 0) ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down";

			cel_1.innerHTML = '<div class="cell"><p class="coin">' + row.name + 
								'</p><p class="' + priceChangeClass +'"> '+
								'<span class= "'+ priceChangeIcon + '" ></span>' 
								+ row.percent_change_24h + '%</p></div>';

			}
		}
	}
	$("#priceTable th:nth-child(2)").text('Price ('+ localStorage["curr"]+')')
	document.getElementById('loading').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {

let currency = localStorage["curr"];
if ( currency == undefined ) {
	currency = "USD";
	localStorage["curr"]="USD"
}
getJSON("https://api.coinmarketcap.com/v1/ticker/?convert="+currency, priceFetch);
addCurrencies();
$('#sel1').val(localStorage["curr"]);
});

$( ".glyphicon-wrench" ).click(function() {
  $(".settings")[0].style.display='block';
});

$( ".glyphicon-remove-circle" ).click(function() {
  $(".settings")[0].style.display='none';
});

$('#sel1').change(function() {
	localStorage["curr"] = $("#sel1 option:selected").val();
	$("#priceTable").find("tr:not(:first)").remove();
	document.getElementById('loading').style.display = 'block';
	getJSON("https://api.coinmarketcap.com/v1/ticker/?convert="+localStorage["curr"], priceFetch);
})

function addCurrencies() {
	var data = ["AUD", "USD","BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];
	$.each(data, function(index,value){
		let option = new Option(data[index], data[index]);
		$('#sel1').append($(option));
	})
}